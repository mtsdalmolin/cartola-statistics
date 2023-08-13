import isNil from 'lodash/isNil'
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
  clube_id: FootballTeamsIds
  posicao_id: PositionsIds
}

export interface RenderedAthlete extends Omit<Athlete, 'pontos_num'> {
  castTimes: number
  captainTimes: number
  sumOfPoints: number
  pointsAverage: number
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

function renderedAthleteFactory(athlete: Athlete, captainId: number) {
  return {
    atleta_id: athlete.atleta_id,
    apelido: athlete.apelido,
    castTimes: 1,
    foto: athlete.foto.replace('FORMATO', PHOTO_SIZE_FORMAT),
    media_num: athlete.media_num,
    captainTimes: 0,
    sumOfPoints: calculatePoints(athlete, captainId),
    pointsAverage: 0,
    clube_id: athlete.clube_id,
    posicao_id: athlete.posicao_id
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
      } else {
        benchStatistics[benchAthlete.atleta_id] = renderedAthleteFactory(benchAthlete, captainId)
      }
    })
  })

  Object.entries(playersStatistics).forEach(([athleteId, athlete]) => {
    playersStatistics[athleteId] = {
      ...athlete,
      pointsAverage: athlete.sumOfPoints / athlete.castTimes
    }
  })
  
  Object.entries(benchStatistics).forEach(([athleteId, athlete]) => {
    benchStatistics[athleteId] = {
      ...athlete,
      pointsAverage: athlete.sumOfPoints / athlete.castTimes
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
