import isNil from 'lodash/isNil'
import max from 'lodash/max'
import { TEAMS } from '../page'
import { type FootballTeamsIds } from '../constants/teams'
import type { Metadata } from 'next'

import './styles.css'
import AthleteList from './components/athlete-list.client'
import { PositionsIds } from '../constants/positions'

export const metadata: Metadata = {
  title: 'Cartola Statistics',
  description: 'Site para analisar estatísticas que o cartola não utiliza.',
}

const CARTOLA_API = 'https://api.cartola.globo.com/'

const PHOTO_SIZE_FORMAT = '220x220'

const TEAM_ROUND_ENDPOINT = (teamId: string) => `time/id/${teamId}/:round`

interface Athlete {
  atleta_id: number
  apelido: string
  foto: string
  media_num: number
  pontos_num: number
  jogos_num: number
  clube_id: FootballTeamsIds
  posicao_id: PositionsIds
  variacao_num: number
  scout: {
    A?: number  // Assistências
    CA?: number // Cartões amarelos
    CV?: number // Cartões vermelhos
    DE?: number // Defesas
    DS?: number // Desarmes
    FC?: number // Faltas cometidas
    FD?: number // Finalizações defendidas
    FF?: number // Finalizações pra fora
    FS?: number // Faltas sofridas
    G?: number  // Gols
    GS?: number // Gols sofridos
    I?: number  // Impedimentos
    SG?: number // Sem sofrer gols
    V?: number  // Vitória
  }
  gato_mestre: {
    minutos_jogados: number
    media_pontos_mandante?: number
    media_pontos_visitante?: number
  }
}

export interface RenderedAthlete extends Omit<Athlete, 'pontos_num'> {
  castTimes: number
  captainTimes: number
  sumOfPoints: number
  overallAverage: number
  sumOfOverallAverage: number
  pointsAverage: number
  sumOfPlayedMinutes: number
  averageMinutesPerRound: number
  valuation: {
    rounds: {
      values: number[]
      aboveZero: number
      belowZero: number
      zero: number
    }
  }
  home: {
    sumOfPoints: number
    average: number
  }
  away: {
    sumOfPoints: number
    average: number
  }
  finishes: number
  finishesToScore: number
  goals: number
  defenses: number
  goalsAgainst: number
  defensesToSufferGoal: number
  minutesToScore: number
  highestPoint: number
}

interface RoundData {
  atletas: Athlete[]
  reservas: Athlete[]
  rodada_atual: number
  capitao_id: number
}

type CrewStatistics = Record<string, RenderedAthlete>

function isCaptain(athleteId: number, captainId: number) {
  return athleteId === captainId
}

function calculatePoints(athlete: Athlete, captainId: number) {
  return isCaptain(athlete.atleta_id, captainId)
    ? athlete.pontos_num * 1.5
    : athlete.pontos_num
}

function handleRoundValuation(roundsValuation: number[]) {
  const valuationRounds = {
    aboveZero: 0,
    belowZero: 0,
    zero: 0
  }

  roundsValuation.forEach(valuation => {
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

function handleGameActions(athlete: Athlete) {
  const actions: Record<string, number> = {
    ...athlete.scout
  }

  Object.keys(athlete.scout).forEach((key: string) => {
    if (actions[key]) {
      actions[key]++
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
    G: goals
  } = handleGameActions(athlete)
  athlete.apelido === 'Luis Suárez' && console.log({ blockedFinishes, outOfTargetFinishes, goals })
  return (blockedFinishes ?? 0) + (outOfTargetFinishes ?? 0) + (goals ?? 0)
}

function renderedAthleteFactory(athlete: Athlete, captainId: number): RenderedAthlete {
  return {
    atleta_id: athlete.atleta_id,
    apelido: athlete.apelido,
    castTimes: 1,
    foto: athlete.foto.replace('FORMATO', PHOTO_SIZE_FORMAT),
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
    gato_mestre: {
      minutos_jogados: athlete.gato_mestre.minutos_jogados,
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
      average: 0,
    },
    highestPoint: athlete.pontos_num,
    finishes: getFinishesNumbers(athlete),
    finishesToScore: 0,
    goals: 0,
    defenses: athlete.scout?.DE ?? 0,
    goalsAgainst: athlete.scout?.GS ?? 0,
    defensesToSufferGoal: 0,
    minutesToScore: 0,
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
    defensesToSufferGoal: athlete.defenses / athlete.goalsAgainst
  }
}

function playerStatisticsIncrementalFactory(statistics: CrewStatistics, athlete: Athlete, captainId: number) {
  if (statistics[athlete.atleta_id]) {
    statistics[athlete.atleta_id].castTimes++
    statistics[athlete.atleta_id].sumOfPoints += calculatePoints(athlete, captainId)
    statistics[athlete.atleta_id].sumOfPlayedMinutes += athlete.gato_mestre.minutos_jogados
    statistics[athlete.atleta_id].home.sumOfPoints += athlete.gato_mestre?.media_pontos_mandante ?? 0
    statistics[athlete.atleta_id].away.sumOfPoints += athlete.gato_mestre?.media_pontos_visitante ?? 0
    statistics[athlete.atleta_id].sumOfOverallAverage += athlete.media_num
    statistics[athlete.atleta_id].highestPoint = max([athlete.pontos_num, statistics[athlete.atleta_id].highestPoint]) ?? 0
    statistics[athlete.atleta_id].jogos_num = athlete.jogos_num
    statistics[athlete.atleta_id].valuation.rounds.values.push(athlete.variacao_num)
    statistics[athlete.atleta_id].scout = {
      ...statistics[athlete.atleta_id].scout,
      ...handleGameActions(athlete)
    }
    statistics[athlete.atleta_id].finishes += getFinishesNumbers(athlete)
    statistics[athlete.atleta_id].goals += handleGameActions(athlete)?.G ?? 0
    statistics[athlete.atleta_id].defenses += handleGameActions(athlete)?.DE ?? 0
    statistics[athlete.atleta_id].goalsAgainst += handleGameActions(athlete)?.GS ?? 0
  } else {
    statistics[athlete.atleta_id] = renderedAthleteFactory(athlete, captainId)
  }

  return statistics
}

async function getPlayersTeamData(endpoint: string, rounds: number[]) {
  const results = await Promise.allSettled<RoundData>(
    rounds.map(round =>
      fetch(`${CARTOLA_API}${endpoint.replace(':round', round.toString())}`)
        .then(res => res.json())
    )
  )

  let playersStatistics: CrewStatistics = {};
  let benchStatistics: CrewStatistics = {};

  results.forEach(result => {
    if (result.status === 'rejected')
      return

    const {
      atletas: athletes,
      reservas: bench,
      capitao_id: captainId
    } = result.value
    
    athletes.forEach(athlete => {
      playersStatistics = playerStatisticsIncrementalFactory(benchStatistics, athlete, captainId)
      
      if (isCaptain(playersStatistics[athlete.atleta_id].atleta_id, captainId)) {
        playersStatistics[athlete.atleta_id].captainTimes++
      }
    })

    bench.forEach(benchAthlete => {
      benchStatistics = playerStatisticsIncrementalFactory(benchStatistics, benchAthlete, captainId)
    })
  })

  Object.entries(playersStatistics).forEach(([athleteId, athlete]) => {
    playersStatistics[athleteId] = handlePlayersDerivedStatistics(athlete)
  })
  
  Object.entries(benchStatistics).forEach(([athleteId, athlete]) => {
    benchStatistics[athleteId] = handlePlayersDerivedStatistics(athlete)
  })

  return [playersStatistics, benchStatistics]
}

export default async function Team({ params }: { params: { teamSlug: string } }) {
  const teamData = TEAMS.find(team => team.slug === params.teamSlug)

  if (isNil(teamData)) {
    return 'no data'
  }

  metadata.title = teamData.name

  const [athletes, bench] = await getPlayersTeamData(
    TEAM_ROUND_ENDPOINT(teamData.id.toString()),
    teamData.rounds
  )

  return (
    <main className="min-h-screen items-center p-24">
      <h1 className="text-2xl">{teamData.name}</h1>
      <AthleteList
        title="Titulares"
        athletes={athletes}
      />
      <AthleteList
        title="Reservas"
        isBench
        athletes={bench}
      />
    </main>
  )
}
