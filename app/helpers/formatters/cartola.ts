import {
  Athlete,
  ClubStatistics,
  CrewStatistics,
  RenderedAthlete
} from '@/app/common/types/athlete'
import { PositionsStatistics } from '@/app/common/types/position'
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
import { RoundData } from '@/app/services/types'

import { max } from 'lodash'

import { isCoach } from '../positions'

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
    blockedFinishes,
    outOfTargetFinishes,
    finishesOnPost,
    goals
  }
}

function getFinishesNumbers(athlete: Athlete) {
  const { blockedFinishes, outOfTargetFinishes, finishesOnPost, goals } =
    getAthleteFinishes(athlete)

  return (blockedFinishes ?? 0) + (outOfTargetFinishes ?? 0) + (finishesOnPost ?? 0) + (goals ?? 0)
}

function renderedAthleteFactory(athlete: Athlete, captainId: number): RenderedAthlete {
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
    sumOfPoints: calculatePoints(athlete, captainId),
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

function handlePlayersDerivedStatistics(athlete: RenderedAthlete) {
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
    victoriesAverage: (athlete.scout?.V ?? 0) / athlete.castTimes
  }
}

function playerStatisticsIncrementalFactory(
  statistics: CrewStatistics,
  athlete: Athlete,
  captainId: number
) {
  if (statistics[athlete.atleta_id]) {
    statistics[athlete.atleta_id].castTimes++
    statistics[athlete.atleta_id].castRounds.push(athlete.rodada_id)
    statistics[athlete.atleta_id].sumOfPoints += calculatePoints(athlete, captainId)
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

export function formatCartolaApiData(
  results: PromiseSettledResult<RoundData>[]
): [CrewStatistics, CrewStatistics, ClubStatistics, PositionsStatistics] {
  let playersStatistics: CrewStatistics = {}
  let benchStatistics: CrewStatistics = {}
  let clubsStatistics: ClubStatistics = {}
  let positionsStatistics: PositionsStatistics = {}
  let seasonPoints = 0

  results.forEach((result) => {
    if (result.status === 'rejected') return

    seasonPoints = result.value.pontos_campeonato

    const { atletas: athletes, reservas: bench, capitao_id: captainId } = result.value

    athletes.forEach((athlete) => {
      playersStatistics = playerStatisticsIncrementalFactory(playersStatistics, athlete, captainId)

      if (isCaptain(playersStatistics[athlete.atleta_id].atleta_id, captainId)) {
        playersStatistics[athlete.atleta_id].captainTimes++
        playersStatistics[athlete.atleta_id].captainRounds.push({
          round: result.value.rodada_atual,
          points: calculatePoints(athlete, captainId),
          rawPoints: athlete.pontos_num
        })
      }

      const athletePoints = calculatePoints(athlete, captainId)

      if (clubsStatistics[athlete.clube_id]) {
        clubsStatistics[athlete.clube_id].points += athletePoints
        clubsStatistics[athlete.clube_id].lineupNumbers++
        clubsStatistics[athlete.clube_id].positions[athlete.posicao_id]++
      } else {
        if (athlete.clube_id !== UNEMPLOYED) {
          clubsStatistics[athlete.clube_id] = {
            id: athlete.clube_id,
            points: athletePoints,
            pointsPercentage: 0,
            lineupNumbers: 1,
            positions: clubPositionFactory(athlete.posicao_id)
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
    })

    bench?.forEach((benchAthlete) => {
      benchStatistics = playerStatisticsIncrementalFactory(benchStatistics, benchAthlete, captainId)
    })
  })

  Object.entries(playersStatistics).forEach(([athleteId, athlete]) => {
    playersStatistics[athleteId] = handlePlayersDerivedStatistics(athlete)
  })

  Object.entries(benchStatistics).forEach(([athleteId, athlete]) => {
    benchStatistics[athleteId] = handlePlayersDerivedStatistics(athlete)
  })

  Object.entries(clubsStatistics).forEach(([clubId, club]) => {
    clubsStatistics[clubId].pointsPercentage = (club.points / seasonPoints) * 100
  })

  Object.entries(positionsStatistics).forEach(([positionId, position]) => {
    positionsStatistics[positionId].pointsPercentage = (position.points / seasonPoints) * 100
  })

  return [playersStatistics, benchStatistics, clubsStatistics, positionsStatistics]
}
