import {
  Athlete,
  ClubStatistics,
  CrewStatistics,
  RenderedAthlete
} from '@/app/common/types/athlete'
import { PositionsStatistics } from '@/app/common/types/position'
import { TeamInfo } from '@/app/common/types/team'
import { TrophiesData } from '@/app/common/types/trophies'
import { Trophies } from '@/app/common/types/trophies'
import { SEASONS, SeasonYears } from '@/app/constants/data'
import {
  ATACANTE,
  GOLEIRO,
  LATERAL,
  MEIA,
  PositionsIds,
  TECNICO,
  ZAGUEIRO
} from '@/app/constants/positions'
import { UNEMPLOYED } from '@/app/constants/teams'
import { RoundData, RoundMatchesData, SubsData } from '@/app/services/types'

import { isEmpty, isEqual, isNil, max, some, uniqBy, uniqWith } from 'lodash'

import { registerTrophyEvent } from '../analytics'
import { isCoach, isGoalkeeper } from '../positions'
import { isValidRound } from '../rounds'
import { typedOrderBy } from '../typed-lodash'

const PHOTO_SIZE_FORMAT = '220x220'

function isCaptain(athleteId: number, captainId: number) {
  return athleteId === captainId
}

export function calculatePoints(athlete: Athlete, captainId: number) {
  return isCaptain(athlete.atleta_id, captainId) ? athlete.pontos_num * 1.5 : athlete.pontos_num
}

function handleRoundValuation(roundsValuation: [number, number][]) {
  const valuationRounds = {
    aboveZero: 0,
    belowZero: 0,
    zero: 0
  }
  let sum = 0

  roundsValuation.forEach(([_, valuation]) => {
    sum += valuation

    if (valuation > 0) {
      valuationRounds.aboveZero++
      return
    }

    if (valuation < 0) {
      valuationRounds.belowZero++
      return
    }

    valuationRounds.zero++
  })

  return {
    ...valuationRounds,
    sum,
    values: uniqWith(roundsValuation, isEqual)
  }
}

function getRoundResultPoints(round: RoundMatchesData[0], clubId: number) {
  if (round && clubId in round) {
    return round[clubId].result.winner === 'draw'
      ? 1
      : round[clubId].result.winner === clubId
      ? 3
      : 0
  }

  return 0
}

export function getRoundResults(athlete: RenderedAthlete, rounds: RoundMatchesData) {
  let results: number[] = []

  athlete.castRounds.forEach((roundId) => {
    results.push(getRoundResultPoints(rounds[roundId], +athlete.clube_id))
  })

  return results
}

function calculateResultEfficiency(athlete: RenderedAthlete, rounds: RoundMatchesData) {
  const results = getRoundResults(athlete, rounds)

  return results.reduce((acc, points) => acc + points, 0) / (athlete.castTimes * 3)
}

export function handleGameActions(athlete: Athlete, cachedStats: typeof athlete.scout = {}) {
  const actions: Record<string, number> = {
    ...cachedStats
  }

  Object.keys(athlete.scout).forEach((key: string) => {
    if (actions[key]) {
      actions[key] += athlete.scout[key as keyof typeof athlete.scout] ?? 0
      return
    }

    actions[key] = athlete.scout[key as keyof typeof athlete.scout] ?? 0
  })

  return actions
}

export function getAthleteFinishes(athlete: Athlete | RenderedAthlete) {
  const {
    FD: blockedFinishes,
    FF: outOfTargetFinishes,
    FT: finishesOnPost,
    G: goals
  } = handleGameActions(athlete as Athlete)

  return {
    blockedFinishes: blockedFinishes ?? 0,
    outOfTargetFinishes: outOfTargetFinishes ?? 0,
    finishesOnPost: finishesOnPost ?? 0,
    goals: goals ?? 0
  }
}

function getFinishesNumbers(athlete: Athlete) {
  const { blockedFinishes, outOfTargetFinishes, finishesOnPost, goals } =
    getAthleteFinishes(athlete)

  return (blockedFinishes ?? 0) + (outOfTargetFinishes ?? 0) + (finishesOnPost ?? 0) + (goals ?? 0)
}

function getBestInPosition(athletes: Athlete[], amount: number) {
  return uniqBy(typedOrderBy(athletes, 'pontos_num', 'desc'), 'atleta_id').splice(0, amount)
}

function getWorstInPosition(athletes: Athlete[], amount: number) {
  return uniqBy(typedOrderBy(athletes, 'pontos_num'), 'atleta_id').splice(0, amount)
}

function renderedAthleteFactory(athlete: Athlete, captainId: number): RenderedAthlete {
  const pointsInRound = calculatePoints(athlete, captainId)
  return {
    atleta_id: athlete.atleta_id,
    rodada_id: athlete.rodada_id,
    apelido: athlete.apelido,
    castTimes: 1,
    castRounds: [athlete.rodada_id],
    foto: athlete.foto?.replace('FORMATO', PHOTO_SIZE_FORMAT) ?? '',
    media_num: athlete.media_num,
    jogos_num: athlete.jogos_num,
    sumOfOverallAverage: athlete.media_num,
    overallAverage: 0,
    captainTimes: 0,
    captainRounds: [],
    sumOfPoints: pointsInRound,
    pointsAverage: 0,
    clube_id: athlete.clube_id,
    posicao_id: athlete.posicao_id,
    variacao_num: athlete.variacao_num,
    preco_num: athlete.preco_num,
    minimo_para_valorizar: athlete.minimo_para_valorizar,
    gato_mestre: {
      minutos_jogados: athlete.gato_mestre?.minutos_jogados ?? 0,
      media_minutos_jogados: athlete.gato_mestre?.minutos_jogados ?? 0,
      media_pontos_mandante: athlete.gato_mestre?.media_pontos_mandante ?? 0,
      media_pontos_visitante: athlete.gato_mestre?.media_pontos_visitante ?? 0
    },
    scout: handleGameActions(athlete),
    sumOfPlayedMinutes: athlete.gato_mestre?.minutos_jogados ?? 0,
    averageMinutesPerRound: 0,
    home: {
      sumOfPoints: 0,
      average: 0
    },
    away: {
      sumOfPoints: 0,
      average: 0
    },
    cardsRounds: {
      yellow: athlete.scout?.CA ?? 0 > 0 ? { [athlete.rodada_id]: athlete.scout?.CA ?? 0 } : {},
      red: athlete.scout?.CV ?? 0 > 0 ? { [athlete.rodada_id]: athlete.scout?.CV ?? 0 } : {}
    },
    highestPoint: athlete.pontos_num,
    highestPointScout: athlete.scout,
    highestPointsRound: athlete.rodada_id,
    assists: athlete.scout?.A ?? 0,
    assistsRounds: athlete.scout?.A ?? 0 > 0 ? { [athlete.rodada_id]: athlete.scout?.A ?? 0 } : {},
    finishes: getFinishesNumbers(athlete),
    finishesOnPost: athlete.scout?.FT ?? 0,
    finishesOnPostRounds:
      athlete.scout?.FT ?? 0 > 0 ? { [athlete.rodada_id]: athlete.scout.FT ?? 0 } : {},
    finishesToScore: 0,
    goals: athlete.scout?.G ?? 0,
    scoredGoalsRounds:
      athlete.scout?.G ?? 0 > 0 ? { [athlete.rodada_id]: athlete.scout?.G ?? 0 } : {},
    defenses: athlete.scout?.DE ?? 0,
    defensesRounds:
      athlete.scout?.DE ?? 0 > 0 ? { [athlete.rodada_id]: athlete.scout?.DE ?? 0 } : {},
    fouls: 0,
    foulsRounds: athlete.scout?.FC ?? 0 > 0 ? { [athlete.rodada_id]: athlete.scout?.FC ?? 0 } : {},
    goalsConceded: athlete.scout?.GS ?? 0,
    goalsConcededRoundIds: athlete.scout?.GS ?? 0 > 0 ? [athlete.rodada_id] : [],
    defensesToSufferGoal: 0,
    minutesToScore: 0,
    participationInGoals: 0,
    participationInGoalsRounds:
      (athlete.scout?.A ?? 0) + (athlete.scout?.G ?? 0) > 0
        ? {
            [athlete.rodada_id]: (athlete.scout?.A ?? 0) + (athlete.scout?.G ?? 0)
          }
        : {},
    offsideRounds: athlete.scout?.I ?? 0 > 0 ? { [athlete.rodada_id]: athlete.scout?.I ?? 0 } : {},
    pointsPerRound: { [athlete.rodada_id]: Number(pointsInRound.toFixed(1)) },
    tacklesRounds:
      athlete.scout?.DS ?? 0 > 0 ? { [athlete.rodada_id]: athlete.scout?.DS ?? 0 } : {},
    victoriesAverage: 0,
    victoriesRoundIds: athlete.scout?.V ?? 0 > 0 ? [athlete.rodada_id] : [],
    valuation: {
      rounds: {
        values: [[athlete.rodada_id, athlete.variacao_num]],
        aboveZero: 0,
        belowZero: 0,
        zero: 0,
        sum: 0
      }
    }
  }
}

function handlePlayersDerivedStatistics(athlete: RenderedAthlete, rounds: RoundMatchesData) {
  const overallAverage = athlete.sumOfOverallAverage / athlete.castTimes
  const defensesToSufferGoal = athlete.defenses / athlete.goalsConceded

  return {
    ...athlete,
    pointsAverage: athlete.sumOfPoints / athlete.castTimes,
    averageMinutesPerRound: athlete.sumOfPlayedMinutes / athlete.castTimes,
    overallAverage: isNaN(overallAverage) ? 0 : overallAverage,
    home: {
      ...athlete.home,
      average: athlete.home.sumOfPoints / athlete.castTimes
    },
    away: {
      ...athlete.away,
      average: athlete.away.sumOfPoints / athlete.castTimes
    },
    valuation: {
      rounds: {
        ...athlete.valuation.rounds,
        ...handleRoundValuation(athlete.valuation.rounds.values)
      }
    },
    finishesToScore: athlete.finishes / athlete.goals,
    minutesToScore: athlete.sumOfPlayedMinutes / athlete.goals,
    participationInGoals: athlete.goals + athlete.assists,
    defensesToSufferGoal: isFinite(defensesToSufferGoal) ? defensesToSufferGoal : athlete.defenses,
    victoriesAverage: calculateResultEfficiency(athlete, rounds)
  }
}

function playerStatisticsIncrementalFactory({
  statistics,
  athlete,
  captainId,
  isBenchStatistics = false
}: {
  statistics: CrewStatistics
  athlete: Athlete
  captainId: number
  isBenchStatistics?: boolean
}) {
  const athleteKey = isBenchStatistics
    ? `${athlete.atleta_id}_${athlete.rodada_id}`
    : athlete.atleta_id

  if (statistics[athleteKey]) {
    const pointsInRound = calculatePoints(athlete, captainId)

    if (!statistics[athleteKey].castRounds.includes(athlete.rodada_id)) {
      statistics[athleteKey].castTimes++
      statistics[athleteKey].castRounds.push(athlete.rodada_id)
      statistics[athleteKey].sumOfPoints += pointsInRound
      statistics[athleteKey].sumOfPlayedMinutes += athlete.gato_mestre?.minutos_jogados ?? 0
      statistics[athleteKey].home.sumOfPoints += athlete.gato_mestre?.media_pontos_mandante ?? 0
      statistics[athleteKey].away.sumOfPoints += athlete.gato_mestre?.media_pontos_visitante ?? 0
      statistics[athleteKey].sumOfOverallAverage += athlete.media_num
      statistics[athleteKey].jogos_num = athlete.jogos_num
      statistics[athleteKey].valuation.rounds.values.push([athlete.rodada_id, athlete.variacao_num])
      statistics[athleteKey].scout = handleGameActions(athlete, statistics[athleteKey].scout)
      statistics[athleteKey].assists += handleGameActions(athlete)?.A ?? 0
      statistics[athleteKey].finishes += getFinishesNumbers(athlete)
      statistics[athleteKey].goals += handleGameActions(athlete)?.G ?? 0
      statistics[athleteKey].defenses += handleGameActions(athlete)?.DE ?? 0
      statistics[athleteKey].fouls += handleGameActions(athlete)?.FC ?? 0
      statistics[athleteKey].finishesOnPost += handleGameActions(athlete)?.FT ?? 0
    }

    const oldHighestPoints = statistics[athleteKey].highestPoint
    statistics[athleteKey].highestPoint =
      max([athlete.pontos_num, statistics[athleteKey].highestPoint]) ?? 0

    if (oldHighestPoints !== statistics[athleteKey].highestPoint) {
      statistics[athleteKey].highestPointScout = athlete.scout
      statistics[athleteKey].highestPointsRound = athlete.rodada_id
    }

    statistics[athleteKey].pointsPerRound[athlete.rodada_id] = Number(pointsInRound.toFixed(1))

    const goalsConceded = handleGameActions(athlete)?.GS ?? 0
    if (goalsConceded) {
      statistics[athleteKey].goalsConceded += handleGameActions(athlete)?.GS ?? 0
      statistics[athleteKey].goalsConcededRoundIds.push(athlete.rodada_id)
    }

    if (isCoach(athlete.posicao_id) && athlete.scout?.V) {
      statistics[athleteKey].victoriesRoundIds.push(athlete.rodada_id)
    }

    if (athlete.scout?.G) {
      statistics[athleteKey].scoredGoalsRounds[athlete.rodada_id] = athlete.scout.G
      statistics[athleteKey].participationInGoalsRounds[athlete.rodada_id] = athlete.scout.G
    }

    if (athlete.scout?.A) {
      statistics[athleteKey].assistsRounds[athlete.rodada_id] = athlete.scout.A
      if (statistics[athleteKey].participationInGoalsRounds[athlete.rodada_id]) {
        statistics[athleteKey].participationInGoalsRounds[athlete.rodada_id] += athlete.scout.A
      } else {
        statistics[athleteKey].participationInGoalsRounds[athlete.rodada_id] = athlete.scout.A
      }
    }

    if (athlete.scout?.DE) {
      statistics[athleteKey].defensesRounds[athlete.rodada_id] = athlete.scout.DE
    }

    if (athlete.scout?.DS) {
      statistics[athleteKey].tacklesRounds[athlete.rodada_id] = athlete.scout.DS
    }

    if (athlete.scout?.I) {
      statistics[athleteKey].offsideRounds[athlete.rodada_id] = athlete.scout.I
    }

    if (athlete.scout?.CA) {
      statistics[athleteKey].cardsRounds.yellow[athlete.rodada_id] = athlete.scout.CA
    }

    if (athlete.scout?.CV) {
      statistics[athleteKey].cardsRounds.red[athlete.rodada_id] = athlete.scout.CV
    }

    if (athlete.scout?.FC) {
      statistics[athleteKey].foulsRounds[athlete.rodada_id] = athlete.scout.FC
    }

    if (athlete.scout?.FT) {
      statistics[athleteKey].finishesOnPostRounds[athlete.rodada_id] = athlete.scout.FT
    }
  } else {
    statistics[athleteKey] = renderedAthleteFactory(athlete, captainId)
  }

  return statistics
}

function clubPositionFactory(positionId?: PositionsIds) {
  const clubPosition = {
    [GOLEIRO]: 0,
    [LATERAL]: 0,
    [ZAGUEIRO]: 0,
    [MEIA]: 0,
    [ATACANTE]: 0,
    [TECNICO]: 0
  }

  if (positionId && positionId in clubPosition)
    clubPosition[positionId as keyof typeof clubPosition]++

  return clubPosition
}

function clubPositionPointsFactory(athlete: Athlete, points: number) {
  const clubPositionPoints = {
    [GOLEIRO]: 0,
    [LATERAL]: 0,
    [ZAGUEIRO]: 0,
    [MEIA]: 0,
    [ATACANTE]: 0,
    [TECNICO]: 0
  }

  if (athlete.posicao_id && athlete.posicao_id in clubPositionPoints)
    clubPositionPoints[athlete.posicao_id as keyof typeof clubPositionPoints] += points

  return clubPositionPoints
}

export function formatCartolaApiData({
  results,
  rounds,
  subs,
  year
}: {
  results: PromiseSettledResult<RoundData>[]
  rounds: RoundMatchesData
  subs: Record<string, SubsData[]>
  year: SeasonYears
}): [
  CrewStatistics,
  CrewStatistics,
  ClubStatistics,
  PositionsStatistics,
  TrophiesData,
  TeamInfo,
  Record<'bestTeam' | 'worstTeam', Athlete[]>
] {
  let playersStatistics: CrewStatistics = {}
  let benchStatistics: CrewStatistics = {}
  let clubsStatistics: ClubStatistics = {}
  let positionsStatistics: PositionsStatistics = {}
  const teamInfo: TeamInfo = {
    id: 1,
    badgePhotoUrl: '',
    name: '',
    pointsPerTurn: {
      first: {
        total: 0,
        average: 0,
        validRounds: 0
      },
      second: {
        total: 0,
        average: 0,
        validRounds: 0
      }
    }
  }
  const teamsTrophies: TrophiesData = {}
  const redCardedAthletes: Athlete[] = []
  const athletesThatMissedPenalty: Athlete[] = []
  const everyAthlete: Record<PositionsIds, Athlete[]> = {
    [ATACANTE]: [],
    [MEIA]: [],
    [LATERAL]: [],
    [ZAGUEIRO]: [],
    [GOLEIRO]: [],
    [TECNICO]: []
  }

  results.forEach(async (result) => {
    if (result.status === 'rejected') return

    const athletesThatScoredInRound: Athlete[] = []
    const athletesThatMadeLessThanZeroPointsInRound: Athlete[] = []
    const athletesThatValuedInRound: Athlete[] = []

    const {
      atletas: athletes,
      reservas: bench,
      capitao_id: captainId,
      patrimonio: wealth,
      pontos: pointsInRound,
      rodada_atual: currentRound,
      time: team
    } = result.value

    if (isNil(team)) {
      return
    }

    teamInfo.badgePhotoUrl = team?.url_escudo_png ?? ''
    teamInfo.name = team?.nome ?? ''
    teamInfo.id = team?.time_id ?? ''

    if (isValidRound(result.value)) {
      if (SEASONS[year].FIRST_TURN_ROUNDS.includes(currentRound)) {
        teamInfo.pointsPerTurn.first.validRounds++
        teamInfo.pointsPerTurn.first.total += pointsInRound
      } else if (SEASONS[year].SECOND_TURN_ROUNDS.includes(currentRound)) {
        teamInfo.pointsPerTurn.second.validRounds++
        teamInfo.pointsPerTurn.second.total += pointsInRound
      }
    }

    athletes.forEach(async (athlete) => {
      everyAthlete[athlete.posicao_id].push(athlete)

      playersStatistics = playerStatisticsIncrementalFactory({
        statistics: playersStatistics,
        athlete,
        captainId
      })
      const athletePoints = calculatePoints(athlete, captainId)

      if (isCaptain(playersStatistics[athlete.atleta_id].atleta_id, captainId)) {
        playersStatistics[athlete.atleta_id].captainTimes++
        playersStatistics[athlete.atleta_id].captainRounds.push({
          round: result.value.rodada_atual,
          points: athletePoints,
          rawPoints: athlete.pontos_num
        })
      }

      if (clubsStatistics[athlete.clube_id]) {
        clubsStatistics[athlete.clube_id].points += athletePoints
        clubsStatistics[athlete.clube_id].lineupNumbers++
        clubsStatistics[athlete.clube_id].positions[athlete.posicao_id]++
        clubsStatistics[athlete.clube_id].positionsPoints[athlete.posicao_id] += athletePoints
      } else {
        if (athlete.clube_id !== UNEMPLOYED) {
          clubsStatistics[athlete.clube_id] = {
            id: athlete.clube_id,
            points: athletePoints,
            pointsPercentage: 0,
            lineupNumbers: 1,
            positions: clubPositionFactory(athlete.posicao_id),
            positionsPoints: clubPositionPointsFactory(athlete, athletePoints)
          }
        }
      }

      if (positionsStatistics[athlete.posicao_id]) {
        positionsStatistics[athlete.posicao_id].points += athletePoints
      } else {
        positionsStatistics[athlete.posicao_id] = {
          id: athlete.posicao_id,
          points: athletePoints,
          pointsPercentage: 0
        }
      }

      if (athlete.minimo_para_valorizar && athlete.pontos_num > athlete.minimo_para_valorizar) {
        athletesThatValuedInRound.push(athlete)
        if (
          !(Trophies.EVERY_ATHLETE_VALUED in teamsTrophies) &&
          athletesThatValuedInRound.length === 12
        ) {
          registerTrophyEvent(Trophies.EVERY_ATHLETE_VALUED, { team: teamInfo })
          teamsTrophies[Trophies.EVERY_ATHLETE_VALUED] = athletesThatValuedInRound
        }
      }

      if (athletePoints < 0) {
        athletesThatMadeLessThanZeroPointsInRound.push(athlete)
        if (
          !(Trophies.FOUR_OR_MORE_PLAYERS_MADE_LESS_THAN_0_POINTS in teamsTrophies) &&
          athletesThatMadeLessThanZeroPointsInRound.length >= 4
        ) {
          registerTrophyEvent(Trophies.FOUR_OR_MORE_PLAYERS_MADE_LESS_THAN_0_POINTS, {
            team: teamInfo
          })
          teamsTrophies[Trophies.FOUR_OR_MORE_PLAYERS_MADE_LESS_THAN_0_POINTS] =
            athletesThatMadeLessThanZeroPointsInRound
        }
      }

      if (
        athletePoints > 30 &&
        !(Trophies.MORE_THAN_30_POINTS_WITH_PLAYER_IN_ROUND in teamsTrophies)
      ) {
        registerTrophyEvent(Trophies.MORE_THAN_30_POINTS_WITH_PLAYER_IN_ROUND, {
          team: teamInfo
        })
        teamsTrophies[Trophies.MORE_THAN_30_POINTS_WITH_PLAYER_IN_ROUND] = [athlete]
      }

      if (athlete.scout?.G && athlete.scout.G > 0) {
        athletesThatScoredInRound.push(athlete)
        if (
          athletesThatScoredInRound.length >= 7 &&
          !(Trophies.SEVEN_PLAYERS_SCORED in teamsTrophies)
        ) {
          registerTrophyEvent(Trophies.SEVEN_PLAYERS_SCORED, { team: teamInfo })
          teamsTrophies[Trophies.SEVEN_PLAYERS_SCORED] = athletesThatScoredInRound
        }

        if (athlete.scout.G === 3) {
          registerTrophyEvent(Trophies.PLAYER_SCORED_HATTRICK, { team: teamInfo })
          teamsTrophies[Trophies.PLAYER_SCORED_HATTRICK] = [athlete]
        }
      }

      if (athlete.scout?.CV && athlete.scout.CV > 0) {
        redCardedAthletes.push(athlete)
        if (
          redCardedAthletes.length >= 3 &&
          !(Trophies.MORE_THAN_THREE_RED_CARDED_PLAYERS in teamsTrophies)
        ) {
          registerTrophyEvent(Trophies.MORE_THAN_THREE_RED_CARDED_PLAYERS, {
            team: teamInfo
          })
          teamsTrophies[Trophies.MORE_THAN_THREE_RED_CARDED_PLAYERS] = redCardedAthletes
        }
      }

      if (athlete.scout?.PP && athlete.scout.PP > 0) {
        athletesThatMissedPenalty.push(athlete)
        if (
          athletesThatMissedPenalty.length >= 3 &&
          !(Trophies.THREE_PLAYERS_MISSED_PENALTY in teamsTrophies)
        ) {
          registerTrophyEvent(Trophies.THREE_PLAYERS_MISSED_PENALTY, { team: teamInfo })
          teamsTrophies[Trophies.THREE_PLAYERS_MISSED_PENALTY] = athletesThatMissedPenalty
        }
      }

      if (pointsInRound < 30 && !(Trophies.LESS_THAN_30_POINTS_IN_ROUND in teamsTrophies)) {
        registerTrophyEvent(Trophies.LESS_THAN_30_POINTS_IN_ROUND, { team: teamInfo })
        teamsTrophies[Trophies.LESS_THAN_30_POINTS_IN_ROUND] = result.value
      }

      if (pointsInRound > 100 && !(Trophies.MORE_THAN_100_POINTS_IN_ROUND in teamsTrophies)) {
        registerTrophyEvent(Trophies.MORE_THAN_100_POINTS_IN_ROUND, { team: teamInfo })
        teamsTrophies[Trophies.MORE_THAN_100_POINTS_IN_ROUND] = result.value
      }

      if (pointsInRound > 150 && !(Trophies.MORE_THAN_150_POINTS_IN_ROUND in teamsTrophies)) {
        registerTrophyEvent(Trophies.MORE_THAN_150_POINTS_IN_ROUND, { team: teamInfo })
        teamsTrophies[Trophies.MORE_THAN_150_POINTS_IN_ROUND] = result.value
      }

      if (isGoalkeeper(athlete.posicao_id)) {
        if (athlete.scout?.A && !(Trophies.ASSIST_WITH_GOALKEEPER in teamsTrophies)) {
          registerTrophyEvent(Trophies.ASSIST_WITH_GOALKEEPER, { team: teamInfo })
          teamsTrophies[Trophies.ASSIST_WITH_GOALKEEPER] = [athlete]
        }
      }
    })

    if (
      !(Trophies.ONE_PLAYER_OF_EACH_CLUB in teamsTrophies) &&
      uniqBy(athletes, 'clube_id').length === 12
    ) {
      registerTrophyEvent(Trophies.ONE_PLAYER_OF_EACH_CLUB, {
        team: teamInfo
      })
      teamsTrophies[Trophies.ONE_PLAYER_OF_EACH_CLUB] = athletes
    }

    if (
      !(Trophies.EVERY_SCHEDULED_PLAYER_IS_FROM_THE_SAME_CLUB in teamsTrophies) &&
      uniqBy(athletes, 'clube_id').length === 1
    ) {
      registerTrophyEvent(Trophies.EVERY_SCHEDULED_PLAYER_IS_FROM_THE_SAME_CLUB, {
        team: teamInfo
      })
      teamsTrophies[Trophies.EVERY_SCHEDULED_PLAYER_IS_FROM_THE_SAME_CLUB] = athletes
    }

    Object.values(subs).forEach((sub) => {
      sub.forEach(async (change) => {
        if (
          !(Trophies.CAME_FROM_BENCH_AND_MADE_12_POINTS in teamsTrophies) &&
          change.entrou.pontos_num >= 12
        ) {
          registerTrophyEvent(Trophies.CAME_FROM_BENCH_AND_MADE_12_POINTS, {
            team: teamInfo
          })
          teamsTrophies[Trophies.CAME_FROM_BENCH_AND_MADE_12_POINTS] = {
            in: change.entrou,
            out: change.saiu
          }
        }
      })
    })

    if (
      !(Trophies.GOALS_IN_THREE_SECTIONS in teamsTrophies) &&
      some(athletesThatScoredInRound, { posicao_id: LATERAL || ZAGUEIRO }) &&
      some(athletesThatScoredInRound, { posicao_id: MEIA }) &&
      some(athletesThatScoredInRound, { posicao_id: ATACANTE })
    ) {
      registerTrophyEvent(Trophies.GOALS_IN_THREE_SECTIONS, { team: teamInfo })
      teamsTrophies[Trophies.GOALS_IN_THREE_SECTIONS] = athletesThatScoredInRound
    }

    const defenseAthletes = athletes.filter((athlete) =>
      [GOLEIRO, ZAGUEIRO, LATERAL].includes(athlete.posicao_id)
    )

    if (
      !isEmpty(defenseAthletes) &&
      !(Trophies.DEFENSE_DIDNT_SUFFER_GOALS in teamsTrophies) &&
      defenseAthletes.every((athlete) => athlete.scout.SG)
    ) {
      registerTrophyEvent(Trophies.DEFENSE_DIDNT_SUFFER_GOALS, { team: teamInfo })
      teamsTrophies[Trophies.DEFENSE_DIDNT_SUFFER_GOALS] = defenseAthletes
    }

    if (!(Trophies.REACHED_200_CARTOLETAS in teamsTrophies) && wealth >= 200) {
      registerTrophyEvent(Trophies.REACHED_200_CARTOLETAS, { team: teamInfo })
      teamsTrophies[Trophies.REACHED_200_CARTOLETAS] = result.value
    }

    const midfielders = athletes.filter((athlete) => MEIA === athlete.posicao_id)

    if (
      !(Trophies.EVERY_MIDFIELDER_HAVE_ASSISTS in teamsTrophies) &&
      !isEmpty(midfielders) &&
      midfielders.every((athlete) => athlete.scout.A)
    ) {
      registerTrophyEvent(Trophies.EVERY_MIDFIELDER_HAVE_ASSISTS, { team: teamInfo })
      teamsTrophies[Trophies.EVERY_MIDFIELDER_HAVE_ASSISTS] = midfielders
    }

    const strikers = athletes.filter((athlete) => ATACANTE === athlete.posicao_id)

    if (
      !(Trophies.EVERY_STRIKER_SCORED in teamsTrophies) &&
      !isEmpty(strikers) &&
      strikers.every((athlete) => athlete.scout.G)
    ) {
      registerTrophyEvent(Trophies.EVERY_STRIKER_SCORED, { team: teamInfo })
      teamsTrophies[Trophies.EVERY_STRIKER_SCORED] = strikers
    }

    bench?.forEach((benchAthlete) => {
      benchStatistics = playerStatisticsIncrementalFactory({
        statistics: benchStatistics,
        athlete: benchAthlete,
        captainId,
        isBenchStatistics: true
      })
    })
  })

  Object.entries(playersStatistics).forEach(([athleteId, athlete]) => {
    playersStatistics[athleteId] = handlePlayersDerivedStatistics(athlete, rounds)
  })

  Object.entries(benchStatistics).forEach(([athleteId, athlete]) => {
    benchStatistics[athleteId] = handlePlayersDerivedStatistics(athlete, rounds)
  })

  const seasonPoints = teamInfo.pointsPerTurn.first.total + teamInfo.pointsPerTurn.second.total

  Object.entries(clubsStatistics).forEach(([clubId, club]) => {
    clubsStatistics[clubId].pointsPercentage = (club.points / seasonPoints) * 100
  })

  Object.entries(positionsStatistics).forEach(([positionId, position]) => {
    positionsStatistics[positionId].pointsPercentage = (position.points / seasonPoints) * 100
  })

  teamInfo.pointsPerTurn.first.average =
    teamInfo.pointsPerTurn.first.total / teamInfo.pointsPerTurn.first.validRounds
  teamInfo.pointsPerTurn.second.average =
    teamInfo.pointsPerTurn.second.total / teamInfo.pointsPerTurn.second.validRounds

  const bestTeam = [
    ...getBestInPosition(everyAthlete[ATACANTE], 3),
    ...getBestInPosition(everyAthlete[MEIA], 3),
    ...getBestInPosition(everyAthlete[LATERAL], 2),
    ...getBestInPosition(everyAthlete[ZAGUEIRO], 2),
    ...getBestInPosition(everyAthlete[GOLEIRO], 1),
    ...getBestInPosition(everyAthlete[TECNICO], 1)
  ]

  const worstTeam = [
    ...getWorstInPosition(everyAthlete[ATACANTE], 3),
    ...getWorstInPosition(everyAthlete[MEIA], 3),
    ...getWorstInPosition(everyAthlete[LATERAL], 2),
    ...getWorstInPosition(everyAthlete[ZAGUEIRO], 2),
    ...getWorstInPosition(everyAthlete[GOLEIRO], 1),
    ...getWorstInPosition(everyAthlete[TECNICO], 1)
  ]

  return [
    playersStatistics,
    benchStatistics,
    clubsStatistics,
    positionsStatistics,
    teamsTrophies,
    teamInfo,
    {
      bestTeam,
      worstTeam
    }
  ]
}
