import type { Metadata } from 'next'

import { request } from '../services/cartola-api'
import { FOOTBALL_TEAMS } from '../constants/teams'
import { Athlete } from '../common/types/athlete'
import { MarketContent } from '../common/components/market-content.client'
import { PHOTO_SIZE_FORMAT } from '../constants/format'
import { getFootballTeamBadgeLink, getFootballTeamName } from '../helpers/teams'
import { getPositionName } from '../helpers/positions'
import { getStatusName } from '../helpers/status'
import { NULL } from '../constants/status'

export const metadata: Metadata = {
  title: 'Mercado',
  description: '',
}

// const ATHLETE_POINTS_ENDPOINT = (round: string) => `/atletas/pontuados/${round}`
const MARKET_ENDPOINT = '/atletas/mercado'

interface MarketData {
  atletas: Athlete[]
  clubes: typeof FOOTBALL_TEAMS[]
  posicoes: unknown[]
  status: unknown[]
}

// interface AthletePointsData {
//   atletas: Athlete[]
//   clubes: typeof FOOTBALL_TEAMS[]
//   posicoes: unknown[]
// }

export interface MarketAthleteTableData {
  id: number
  name: string
  photoUrl: string
  club: string
  clubBadgeUrl: string
  position: string
  performance: number
  minToValuate: number
  status: string
  points: number
  pointsAverage: number
  price: number
  pointsAverageHome: number
  pointsAverageAway: number
  minutesPlayedAverage: number
}

function marketAthleteTableDataFactory(athlete: Athlete): MarketAthleteTableData {
  return {
    id: athlete.atleta_id,
    name: athlete.apelido,
    photoUrl: athlete.foto?.replace('FORMATO', PHOTO_SIZE_FORMAT) ?? '',
    club: getFootballTeamName(athlete.clube_id),
    clubBadgeUrl: getFootballTeamBadgeLink(athlete.clube_id),
    position: getPositionName(athlete.posicao_id),
    performance: athlete.variacao_num,
    minToValuate: athlete.minimo_para_valorizar,
    status: getStatusName(athlete?.status_id ?? NULL),
    points: athlete.pontos_num,
    pointsAverage: athlete.media_num,
    price: athlete.preco_num,
    pointsAverageHome: athlete.gato_mestre?.media_pontos_mandante ?? 0,
    pointsAverageAway: athlete.gato_mestre?.media_pontos_visitante ?? 0,
    minutesPlayedAverage: athlete.gato_mestre?.media_minutos_jogados ?? 0
  }
}

export type MarketStatistics = MarketAthleteTableData[]

async function getMarketData() {
  const { atletas: athletes }: MarketData = await request(MARKET_ENDPOINT).then(res => res.json())

  const marketStatistics: MarketStatistics = []
  athletes.forEach(athlete => marketStatistics.push(marketAthleteTableDataFactory(athlete)))

  return { marketStatistics }
}

export default async function Market() {
  const { marketStatistics } = await getMarketData()

  if (!marketStatistics) {
    return 'no market data'
  }

  return (
    <main className="max-w-[80vw] h-screen m-auto items-center">
      <MarketContent athletes={marketStatistics} />
    </main>
  )
}
