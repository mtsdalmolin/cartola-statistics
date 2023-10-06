import {
  Athlete,
  ClubStatistics,
  CrewStatistics,
  RenderedAthlete
} from '@/app/common/types/athlete'
import { PositionsStatistics } from '@/app/common/types/position'
import { UNEMPLOYED } from '@/app/constants/teams'
import { RoundData } from '@/app/services/types'

import { max } from 'lodash'

const PHOTO_SIZE_FORMAT = '220x220'

function isCaptain(athleteId: number, captainId: number) {
  return athleteId === captainId
}

function calculatePoints(athlete: Athlete, captainId: number) {
  return isCaptain(athlete.atleta_id, captainId) ? athlete.pontos_num * 1.5 : athlete.pontos_num
}

function handleRoundValuation(roundsValuation: number[]) {
  const valuationRounds = {
    aboveZero: 0,
    belowZero: 0,
    zero: 0
  }

  roundsValuation.forEach((valuation) => {
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

function getFinishesNumbers(athlete: Athlete) {
  const {
    FD: blockedFinishes,
    FF: outOfTargetFinishes,
    FT: finishesOnPost,
    G: goals
  } = handleGameActions(athlete)

  return (blockedFinishes ?? 0) + (outOfTargetFinishes ?? 0) + (finishesOnPost ?? 0) + (goals ?? 0)
}

function renderedAthleteFactory(athlete: Athlete, captainId: number): RenderedAthlete {
  return {
    atleta_id: athlete.atleta_id,
    apelido: athlete.apelido,
    castTimes: 1,
    foto: athlete.foto?.replace('FORMATO', PHOTO_SIZE_FORMAT) ?? '',
    media_num: athlete.media_num,
    jogos_num: athlete.jogos_num,
    sumOfOverallAverage: athlete.media_num,
    overallAverage: 0,
    captainTimes: 0,
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
    highestPoint: athlete.pontos_num,
    finishes: getFinishesNumbers(athlete),
    finishesToScore: 0,
    goals: 0,
    defenses: athlete.scout?.DE ?? 0,
    goalsAgainst: athlete.scout?.GS ?? 0,
    defensesToSufferGoal: 0,
    minutesToScore: 0,
    victoriesAverage: 0,
    valuation: {
      rounds: {
        values: [athlete.variacao_num],
        aboveZero: 0,
        belowZero: 0,
        zero: 0
      }
    }
  }
}

function handlePlayersDerivedStatistics(athlete: RenderedAthlete) {
  const overallAverage = athlete.sumOfOverallAverage / athlete.castTimes
  const defensesToSufferGoal = athlete.defenses / athlete.goalsAgainst

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
    statistics[athlete.atleta_id].sumOfPoints += calculatePoints(athlete, captainId)
    statistics[athlete.atleta_id].sumOfPlayedMinutes += athlete.gato_mestre.minutos_jogados
    statistics[athlete.atleta_id].home.sumOfPoints +=
      athlete.gato_mestre?.media_pontos_mandante ?? 0
    statistics[athlete.atleta_id].away.sumOfPoints +=
      athlete.gato_mestre?.media_pontos_visitante ?? 0
    statistics[athlete.atleta_id].sumOfOverallAverage += athlete.media_num
    statistics[athlete.atleta_id].highestPoint =
      max([athlete.pontos_num, statistics[athlete.atleta_id].highestPoint]) ?? 0
    statistics[athlete.atleta_id].jogos_num = athlete.jogos_num
    statistics[athlete.atleta_id].valuation.rounds.values.push(athlete.variacao_num)
    statistics[athlete.atleta_id].scout = handleGameActions(
      athlete,
      statistics[athlete.atleta_id].scout
    )
    statistics[athlete.atleta_id].finishes += getFinishesNumbers(athlete)
    statistics[athlete.atleta_id].goals += handleGameActions(athlete)?.G ?? 0
    statistics[athlete.atleta_id].defenses += handleGameActions(athlete)?.DE ?? 0
    statistics[athlete.atleta_id].goalsAgainst += handleGameActions(athlete)?.GS ?? 0
  } else {
    statistics[athlete.atleta_id] = renderedAthleteFactory(athlete, captainId)
  }

  return statistics
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
      }

      const athletePoints = calculatePoints(athlete, captainId)

      if (clubsStatistics[athlete.clube_id]) {
        clubsStatistics[athlete.clube_id].points += athletePoints
      } else {
        if (athlete.clube_id !== UNEMPLOYED) {
          clubsStatistics[athlete.clube_id] = {
            id: athlete.clube_id,
            points: athletePoints,
            pointsPercentage: 0
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
