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
import { FIRST_TURN_ROUNDS, SECOND_TURN_ROUNDS } from '@/app/constants/data'
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

import { isEmpty, max, some } from 'lodash'

import { isCoach } from '../positions'
import { isValidRound } from '../rounds'

const PHOTO_SIZE_FORMAT = '220x220'

function isCaptain(athleteId: number, captainId: number) {
  return athleteId === captainId
}

function calculatePoints(athlete: Athlete, captainId: number) {
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
    values: roundsValuation
  }
}

function getRoundResultPoints(round: RoundMatchesData[0], clubId: number) {
  if (clubId in round) {
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
    results.push(getRoundResultPoints(rounds[roundId], athlete.clube_id))
  })

  return results
}

function calculateResultEfficiency(athlete: RenderedAthlete, rounds: RoundMatchesData) {
  const results = getRoundResults(athlete, rounds)

  return results.reduce((acc, points) => acc + points, 0) / (athlete.castTimes * 3)
}

function handleGameActions(athlete: Athlete, cachedStats: typeof athlete.scout = {}) {
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
      minutos_jogados: athlete.gato_mestre.minutos_jogados,
      media_minutos_jogados: athlete.gato_mestre?.minutos_jogados ?? 0,
      media_pontos_mandante: athlete.gato_mestre?.media_pontos_mandante ?? 0,
      media_pontos_visitante: athlete.gato_mestre?.media_pontos_visitante ?? 0
    },
    scout: handleGameActions(athlete),
    sumOfPlayedMinutes: athlete.gato_mestre.minutos_jogados,
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
    finishesToScore: 0,
    goals: athlete.scout?.G ?? 0,
    scoredGoalsRounds:
      athlete.scout?.G ?? 0 > 0 ? { [athlete.rodada_id]: athlete.scout?.G ?? 0 } : {},
    defenses: athlete.scout?.DE ?? 0,
    defensesRounds:
      athlete.scout?.DE ?? 0 > 0 ? { [athlete.rodada_id]: athlete.scout?.DE ?? 0 } : {},
    goalsConceded: athlete.scout?.GS ?? 0,
    goalsConcededRoundIds: athlete.scout?.GS ?? 0 > 0 ? [athlete.rodada_id] : [],
    defensesToSufferGoal: 0,
    minutesToScore: 0,
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
    defensesToSufferGoal: isFinite(defensesToSufferGoal) ? defensesToSufferGoal : athlete.defenses,
    victoriesAverage: calculateResultEfficiency(athlete, rounds)
  }
}

function playerStatisticsIncrementalFactory(
  statistics: CrewStatistics,
  athlete: Athlete,
  captainId: number
) {
  if (statistics[athlete.atleta_id]) {
    const pointsInRound = calculatePoints(athlete, captainId)

    statistics[athlete.atleta_id].castTimes++
    statistics[athlete.atleta_id].castRounds.push(athlete.rodada_id)
    statistics[athlete.atleta_id].sumOfPoints += pointsInRound
    statistics[athlete.atleta_id].sumOfPlayedMinutes += athlete.gato_mestre.minutos_jogados
    statistics[athlete.atleta_id].home.sumOfPoints +=
      athlete.gato_mestre?.media_pontos_mandante ?? 0
    statistics[athlete.atleta_id].away.sumOfPoints +=
      athlete.gato_mestre?.media_pontos_visitante ?? 0
    statistics[athlete.atleta_id].sumOfOverallAverage += athlete.media_num
    statistics[athlete.atleta_id].jogos_num = athlete.jogos_num
    statistics[athlete.atleta_id].valuation.rounds.values.push([
      athlete.rodada_id,
      athlete.variacao_num
    ])
    statistics[athlete.atleta_id].scout = handleGameActions(
      athlete,
      statistics[athlete.atleta_id].scout
    )
    statistics[athlete.atleta_id].assists += handleGameActions(athlete)?.A ?? 0
    statistics[athlete.atleta_id].finishes += getFinishesNumbers(athlete)
    statistics[athlete.atleta_id].goals += handleGameActions(athlete)?.G ?? 0
    statistics[athlete.atleta_id].defenses += handleGameActions(athlete)?.DE ?? 0

    const oldHighestPoints = statistics[athlete.atleta_id].highestPoint
    statistics[athlete.atleta_id].highestPoint =
      max([athlete.pontos_num, statistics[athlete.atleta_id].highestPoint]) ?? 0

    if (oldHighestPoints !== statistics[athlete.atleta_id].highestPoint) {
      statistics[athlete.atleta_id].highestPointScout = athlete.scout
      statistics[athlete.atleta_id].highestPointsRound = athlete.rodada_id
    }

    statistics[athlete.atleta_id].pointsPerRound[athlete.rodada_id] = Number(
      pointsInRound.toFixed(1)
    )

    const goalsConceded = handleGameActions(athlete)?.GS ?? 0
    if (goalsConceded) {
      statistics[athlete.atleta_id].goalsConceded += handleGameActions(athlete)?.GS ?? 0
      statistics[athlete.atleta_id].goalsConcededRoundIds.push(athlete.rodada_id)
    }

    if (isCoach(athlete.posicao_id)) {
      statistics[athlete.atleta_id].victoriesRoundIds.push(athlete.rodada_id)
    }

    if (athlete.scout?.G) {
      statistics[athlete.atleta_id].scoredGoalsRounds[athlete.rodada_id] = athlete.scout.G
    }

    if (athlete.scout?.A) {
      statistics[athlete.atleta_id].assistsRounds[athlete.rodada_id] = athlete.scout.A
    }

    if (athlete.scout?.DE) {
      statistics[athlete.atleta_id].defensesRounds[athlete.rodada_id] = athlete.scout.DE
    }

    if (athlete.scout?.DS) {
      statistics[athlete.atleta_id].tacklesRounds[athlete.rodada_id] = athlete.scout.DS
    }

    if (athlete.scout?.I) {
      statistics[athlete.atleta_id].offsideRounds[athlete.rodada_id] = athlete.scout.I
    }

    if (athlete.scout?.CA) {
      statistics[athlete.atleta_id].cardsRounds.yellow[athlete.rodada_id] = athlete.scout.CA
    }

    if (athlete.scout?.CV) {
      statistics[athlete.atleta_id].cardsRounds.red[athlete.rodada_id] = athlete.scout.CV
    }
  } else {
    statistics[athlete.atleta_id] = renderedAthleteFactory(athlete, captainId)
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

export function formatCartolaApiData(
  results: PromiseSettledResult<RoundData>[],
  rounds: RoundMatchesData,
  subs: Record<string, SubsData[]>
): [CrewStatistics, CrewStatistics, ClubStatistics, PositionsStatistics, TrophiesData, TeamInfo] {
  let playersStatistics: CrewStatistics = {}
  let benchStatistics: CrewStatistics = {}
  let clubsStatistics: ClubStatistics = {}
  let positionsStatistics: PositionsStatistics = {}
  const teamInfo: TeamInfo = {
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

  results.forEach((result) => {
    if (result.status === 'rejected') return

    teamInfo.badgePhotoUrl = result.value.time.url_escudo_png
    teamInfo.name = result.value.time.nome

    if (isValidRound(result.value)) {
      if (FIRST_TURN_ROUNDS.includes(result.value.rodada_atual)) {
        teamInfo.pointsPerTurn.first.validRounds++
        teamInfo.pointsPerTurn.first.total += result.value.pontos
      } else if (SECOND_TURN_ROUNDS.includes(result.value.rodada_atual)) {
        teamInfo.pointsPerTurn.second.validRounds++
        teamInfo.pointsPerTurn.second.total += result.value.pontos
      }
    }

    const athletesThatScoredInRound: Athlete[] = []
    const athletesThatMadeLessThanZeroPointsInRound: Athlete[] = []
    const athletesThatValuedInRound: Athlete[] = []

    const {
      atletas: athletes,
      reservas: bench,
      capitao_id: captainId,
      patrimonio: wealth,
      pontos: pointsInRound,
      rodada_atual: currentRound
    } = result.value

    athletes.forEach((athlete) => {
      playersStatistics = playerStatisticsIncrementalFactory(playersStatistics, athlete, captainId)
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

      if (athletePoints > athlete.minimo_para_valorizar) {
        athletesThatValuedInRound.push(athlete)
        if (
          !(Trophies.EVERY_ATHLETE_VALUED in teamsTrophies) &&
          athletesThatValuedInRound.length === 12
        ) {
          teamsTrophies[Trophies.EVERY_ATHLETE_VALUED] = athletesThatValuedInRound
        }
      }

      if (athletePoints < 0) {
        athletesThatMadeLessThanZeroPointsInRound.push(athlete)
        if (
          !(Trophies.FOUR_OR_MORE_PLAYERS_MADE_LESS_THAN_0_POINTS in teamsTrophies) &&
          athletesThatMadeLessThanZeroPointsInRound.length >= 4
        ) {
          teamsTrophies[Trophies.FOUR_OR_MORE_PLAYERS_MADE_LESS_THAN_0_POINTS] =
            athletesThatMadeLessThanZeroPointsInRound
        }
      }

      if (
        athletePoints > 30 &&
        !(Trophies.MORE_THAN_30_POINTS_WITH_PLAYER_IN_ROUND in teamsTrophies)
      ) {
        teamsTrophies[Trophies.MORE_THAN_30_POINTS_WITH_PLAYER_IN_ROUND] = [athlete]
      }

      if (athlete.scout?.G && athlete.scout.G > 0) {
        athletesThatScoredInRound.push(athlete)
        if (
          athletesThatScoredInRound.length >= 7 &&
          !(Trophies.SEVEN_PLAYERS_SCORED in teamsTrophies)
        ) {
          teamsTrophies[Trophies.SEVEN_PLAYERS_SCORED] = athletesThatScoredInRound
        }

        if (athlete.scout.G === 3) {
          teamsTrophies[Trophies.PLAYER_SCORED_HATTRICK] = [athlete]
        }
      }

      if (athlete.scout?.CV && athlete.scout.CV > 0) {
        redCardedAthletes.push(athlete)
        if (
          redCardedAthletes.length >= 3 &&
          !(Trophies.MORE_THAN_THREE_RED_CARDED_PLAYERS in teamsTrophies)
        ) {
          teamsTrophies[Trophies.MORE_THAN_THREE_RED_CARDED_PLAYERS] = redCardedAthletes
        }
      }

      if (athlete.scout?.PP && athlete.scout.PP > 0) {
        athletesThatMissedPenalty.push(athlete)
        if (
          athletesThatMissedPenalty.length >= 3 &&
          !(Trophies.THREE_PLAYERS_MISSED_PENALTY in teamsTrophies)
        ) {
          teamsTrophies[Trophies.THREE_PLAYERS_MISSED_PENALTY] = athletesThatMissedPenalty
        }
      }

      if (pointsInRound < 30 && !(Trophies.LESS_THAN_30_POINTS_IN_ROUND in teamsTrophies)) {
        teamsTrophies[Trophies.LESS_THAN_30_POINTS_IN_ROUND] = result.value
      }

      if (pointsInRound > 100 && !(Trophies.MORE_THAN_100_POINTS_IN_ROUND in teamsTrophies)) {
        teamsTrophies[Trophies.MORE_THAN_100_POINTS_IN_ROUND] = result.value
      }

      if (pointsInRound > 150 && !(Trophies.MORE_THAN_150_POINTS_IN_ROUND in teamsTrophies)) {
        teamsTrophies[Trophies.MORE_THAN_150_POINTS_IN_ROUND] = result.value
      }
    })

    Object.entries(subs).forEach(([_, sub]) => {
      sub.forEach((change) => {
        if (
          !(Trophies.CAME_FROM_BENCH_AND_MADE_12_POINTS in teamsTrophies) &&
          change.entrou.pontos_num >= 12
        ) {
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
      teamsTrophies[Trophies.DEFENSE_DIDNT_SUFFER_GOALS] = defenseAthletes
    }

    if (!(Trophies.REACHED_200_CARTOLETAS in teamsTrophies) && wealth >= 200) {
      teamsTrophies[Trophies.REACHED_200_CARTOLETAS] = result.value
    }

    const midfielders = athletes.filter((athlete) => MEIA === athlete.posicao_id)

    if (
      !(Trophies.EVERY_MIDFIELDER_HAVE_ASSISTS in teamsTrophies) &&
      !isEmpty(midfielders) &&
      midfielders.every((athlete) => athlete.scout.A)
    ) {
      teamsTrophies[Trophies.EVERY_MIDFIELDER_HAVE_ASSISTS] = midfielders
    }

    const strikers = athletes.filter((athlete) => ATACANTE === athlete.posicao_id)

    if (
      !(Trophies.EVERY_STRIKER_SCORED in teamsTrophies) &&
      !isEmpty(strikers) &&
      strikers.every((athlete) => athlete.scout.G)
    ) {
      teamsTrophies[Trophies.EVERY_STRIKER_SCORED] = strikers
    }

    bench?.forEach((benchAthlete) => {
      benchStatistics = playerStatisticsIncrementalFactory(benchStatistics, benchAthlete, captainId)
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

  return [
    playersStatistics,
    benchStatistics,
    clubsStatistics,
    positionsStatistics,
    teamsTrophies,
    teamInfo
  ]
}
