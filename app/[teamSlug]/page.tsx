import orderBy from 'lodash/orderBy'
import isNil from 'lodash/isNil'
import { TEAMS } from '../page'
import Image from 'next/image'

import './styles.css'
import AthleteList from './components/athlete-list.client'

const CARTOLA_API = 'https://api.cartola.globo.com/'

const ROUNDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]

const PHOTO_SIZE_FORMAT = '220x220'

const TEAM_ROUND_ENDPOINT = (teamId: string) => `time/id/${teamId}/:round`

interface Athlete {
  atleta_id: number
  apelido: string
  foto: string
  media_num: number
  pontos_num: number
}

export interface RenderedAthlete extends Omit<Athlete, 'pontos_num'> {
  castTimes: number
  captainTimes: number
  sumOfPoints: number
  pointsAverage: number
}

interface RoundData {
  atletas: Athlete[]
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

async function getPlayersTeamData(endpoint: string) {
  const roundsData: RoundData[] = await Promise.all(
    ROUNDS.map(round =>
      fetch(`${CARTOLA_API}${endpoint.replace(':round', round.toString())}`)
        .then(res => res.json())
    )
  )

  const playersStatistics: Record<string, RenderedAthlete> = {};

  roundsData.forEach(round => {
    const { atletas: athletes } = round
    const captainId = round.capitao_id
    athletes.forEach(athlete => {
      if (playersStatistics[athlete.atleta_id]) {
        playersStatistics[athlete.atleta_id].castTimes++
        playersStatistics[athlete.atleta_id].sumOfPoints += calculatePoints(athlete, captainId)
      } else {
        playersStatistics[athlete.atleta_id] = {
          atleta_id: athlete.atleta_id,
          apelido: athlete.apelido,
          castTimes: 1,
          foto: athlete.foto.replace('FORMATO', PHOTO_SIZE_FORMAT),
          media_num: athlete.media_num,
          captainTimes: 0,
          sumOfPoints: calculatePoints(athlete, captainId),
          pointsAverage: 0
        }
      }

      if (isCaptain(playersStatistics[athlete.atleta_id].atleta_id, captainId)) {
        playersStatistics[athlete.atleta_id].captainTimes++
      }
    })
  })

  Object.entries(playersStatistics).forEach(([athleteId, athlete]) => {
    playersStatistics[athleteId] = {
      ...athlete,
      pointsAverage: athlete.sumOfPoints / athlete.castTimes
    }
  })

  return playersStatistics
}

export default async function Team({ params }: { params: { teamSlug: string } }) {
  const teamData = TEAMS.find(team => team.slug === params.teamSlug)

  if (isNil(teamData)) {
    return 'no data'
  }

  const data = await getPlayersTeamData(TEAM_ROUND_ENDPOINT(teamData.id.toString()))

  return (
    <main className="min-h-screen items-center p-24">
      <h1 className="text-xl">{teamData.name}</h1>
      <AthleteList athletes={data} />
    </main>
  )
}
