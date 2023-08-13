import isNil from 'lodash/isNil'
import { TEAMS } from '../page'
import { type FootballTeamsIds } from '../constants/teams'
import type { Metadata } from 'next'

import './styles.css'
import AthleteList from './components/athlete-list.client'
import { PositionsIds } from '../constants/positions'
import { forEach } from 'lodash'

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
    A?: number
    CA?: number
    CV?: number
    DE?: number
    DS?: number
    FC?: number
    FD?: number
    FF?: number
    FS?: number
    G?: number
    I?: number
    SG?: number
  }
  gato_mestre: {
    minutos_jogados: number
    media_pontos_mandante: number
    media_pontos_visitante: number
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
  goals: number
  minutesToGoal: number
}

interface RoundData {
  atletas: Athlete[]
  reservas: Athlete[]
  rodada_atual: number
  capitao_id: number
}

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
    values: roundsValuation,
    ...valuationRounds
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

function renderedAthleteFactory(athlete: Athlete, captainId: number): RenderedAthlete {
  return {
    atleta_id: athlete.atleta_id,
    apelido: athlete.apelido,
    castTimes: 1,
    foto: athlete.foto.replace('FORMATO', PHOTO_SIZE_FORMAT),
    media_num: athlete.media_num,
    jogos_num: athlete.jogos_num,
    sumOfOverallAverage: 0,
    overallAverage: 0,
    captainTimes: 0,
    sumOfPoints: calculatePoints(athlete, captainId),
    pointsAverage: 0,
    clube_id: athlete.clube_id,
    posicao_id: athlete.posicao_id,
    variacao_num: athlete.variacao_num,
    gato_mestre: {
      minutos_jogados: athlete.gato_mestre.minutos_jogados,
      media_pontos_mandante: athlete.gato_mestre.media_pontos_mandante,
      media_pontos_visitante: athlete.gato_mestre.media_pontos_visitante
    },
    scout: handleGameActions(athlete),
    sumOfPlayedMinutes: 0,
    averageMinutesPerRound: 0,
    home: {
      sumOfPoints: 0,
      average: 0
    },
    away: {
      sumOfPoints: 0,
      average: 0,
    },
    goals: 0,
    minutesToGoal: 0,
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

async function getPlayersTeamData(endpoint: string, rounds: number[]) {
  const results = await Promise.allSettled<RoundData>(
    rounds.map(round =>
      fetch(`${CARTOLA_API}${endpoint.replace(':round', round.toString())}`)
        .then(res => res.json())
    )
  )

  const playersStatistics: Record<string, RenderedAthlete> = {};
  const benchStatistics: Record<string, RenderedAthlete> = {};

  results.forEach(result => {
    if (result.status === 'rejected')
      return

    const {
      atletas: athletes,
      reservas: bench,
      capitao_id: captainId
    } = result.value
    
    athletes.forEach(athlete => {
      if (playersStatistics[athlete.atleta_id]) {
        playersStatistics[athlete.atleta_id].castTimes++
        playersStatistics[athlete.atleta_id].sumOfPoints += calculatePoints(athlete, captainId)
        playersStatistics[athlete.atleta_id].sumOfPlayedMinutes += athlete.gato_mestre.minutos_jogados
        playersStatistics[athlete.atleta_id].home.sumOfPoints += athlete.gato_mestre.media_pontos_mandante
        playersStatistics[athlete.atleta_id].away.sumOfPoints += athlete.gato_mestre.media_pontos_visitante
        playersStatistics[athlete.atleta_id].sumOfOverallAverage += athlete.media_num
        playersStatistics[athlete.atleta_id].jogos_num = athlete.jogos_num
        playersStatistics[athlete.atleta_id].valuation.rounds.values.push(athlete.variacao_num)
        playersStatistics[athlete.atleta_id].scout = {
          ...playersStatistics[athlete.atleta_id].scout,
          ...handleGameActions(athlete)
        }
        playersStatistics[athlete.atleta_id].goals += handleGameActions(athlete)?.G ?? 0
      } else {
        playersStatistics[athlete.atleta_id] = renderedAthleteFactory(athlete, captainId)
      }

      if (isCaptain(playersStatistics[athlete.atleta_id].atleta_id, captainId)) {
        playersStatistics[athlete.atleta_id].captainTimes++
      }
    })

    bench.forEach(benchAthlete => {
      if (benchStatistics[benchAthlete.atleta_id]) {
        benchStatistics[benchAthlete.atleta_id].castTimes++
        benchStatistics[benchAthlete.atleta_id].sumOfPoints += calculatePoints(benchAthlete, captainId)
        benchStatistics[benchAthlete.atleta_id].sumOfPlayedMinutes += benchAthlete.gato_mestre.minutos_jogados
        benchStatistics[benchAthlete.atleta_id].home.sumOfPoints += benchAthlete.gato_mestre.media_pontos_mandante
        benchStatistics[benchAthlete.atleta_id].away.sumOfPoints += benchAthlete.gato_mestre.media_pontos_visitante
        benchStatistics[benchAthlete.atleta_id].sumOfOverallAverage += benchAthlete.media_num
        benchStatistics[benchAthlete.atleta_id].jogos_num = benchAthlete.jogos_num
        benchStatistics[benchAthlete.atleta_id].valuation.rounds.values.push(benchAthlete.variacao_num)
        benchStatistics[benchAthlete.atleta_id].scout = {
          ...benchStatistics[benchAthlete.atleta_id].scout,
          ...handleGameActions(benchAthlete)
        }
        benchStatistics[benchAthlete.atleta_id].goals += handleGameActions(benchAthlete)?.G ?? 0
      } else {
        benchStatistics[benchAthlete.atleta_id] = renderedAthleteFactory(benchAthlete, captainId)
      }
    })
  })

  Object.entries(playersStatistics).forEach(([athleteId, athlete]) => {
    playersStatistics[athleteId] = {
      ...athlete,
      pointsAverage: athlete.sumOfPoints / athlete.castTimes,
      averageMinutesPerRound: athlete.sumOfPlayedMinutes / athlete.castTimes,
      home: {
        ...athlete.home,
        average: athlete.home.sumOfPoints / athlete.castTimes
      },
      away: {
        ...athlete.away,
        average: athlete.away.sumOfPoints / athlete.castTimes
      },
      overallAverage: athlete.sumOfOverallAverage / athlete.castTimes,
      valuation: {
        rounds: {
          ...athlete.valuation.rounds,
          ...handleRoundValuation(athlete.valuation.rounds.values)
        }
      },
      minutesToGoal: athlete.sumOfPlayedMinutes / athlete.goals
    }
  })
  
  Object.entries(benchStatistics).forEach(([athleteId, athlete]) => {
    benchStatistics[athleteId] = {
      ...athlete,
      pointsAverage: athlete.sumOfPoints / athlete.castTimes,
      averageMinutesPerRound: athlete.sumOfPlayedMinutes / athlete.castTimes,
      home: {
        ...athlete.home,
        average: athlete.home.sumOfPoints / athlete.castTimes
      },
      away: {
        ...athlete.away,
        average: athlete.away.sumOfPoints / athlete.castTimes
      },
      overallAverage: athlete.sumOfOverallAverage / athlete.jogos_num,
      valuation: {
        rounds: {
          ...athlete.valuation.rounds,
          ...handleRoundValuation(athlete.valuation.rounds.values)
        }
      },
      minutesToGoal: athlete.sumOfPlayedMinutes / athlete.goals
    }
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
