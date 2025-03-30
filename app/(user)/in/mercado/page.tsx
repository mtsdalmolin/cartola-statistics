import type { Metadata } from 'next'

import type { Match } from '@/app/common/types/match'
import { getJwtToken, getRefreshToken } from '@/app/services/auth/api'

import { MarketContent } from '../../../common/components/market-content.client'
import { Athlete } from '../../../common/types/athlete'
import { PHOTO_SIZE_FORMAT } from '../../../constants/format'
import { NULL } from '../../../constants/status'
import { FOOTBALL_TEAMS } from '../../../constants/teams'
import { getPositionName } from '../../../helpers/positions'
import { getStatusName } from '../../../helpers/status'
import { getFootballTeamBadgeLink, getFootballTeamName } from '../../../helpers/teams'
import {
  ENDPOINTS,
  getAthletesValuation,
  getMatchesData,
  request
} from '../../../services/cartola-api'

export const metadata: Metadata = {
  title: 'Mercado',
  description: ''
}

interface MarketData {
  atletas: Athlete[]
  clubes: (typeof FOOTBALL_TEAMS)[]
  posicoes: unknown[]
  status: unknown[]
}
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
  match: Match
}

export interface AthletesValuation {
  media_pontos_mandante?: number
  media_pontos_visitante?: number
  media_minutos_jogados?: number
  minutos_jogados?: number
  minimo_para_valorizar?: number
}

export interface AthletesValuationResponseFromApi {
  [key: string]: AthletesValuation
}

function marketAthleteTableDataFactory(
  athlete: Athlete,
  roundMatches: { [key: string]: Match },
  athletesValuation: AthletesValuationResponseFromApi
): MarketAthleteTableData {
  return {
    id: athlete.atleta_id,
    name: athlete.apelido,
    photoUrl: athlete.foto?.replace('FORMATO', PHOTO_SIZE_FORMAT) ?? '',
    club: getFootballTeamName(athlete.clube_id),
    clubBadgeUrl: getFootballTeamBadgeLink(athlete.clube_id),
    position: getPositionName(athlete.posicao_id),
    performance: athlete.variacao_num,
    minToValuate:
      athletesValuation[athlete.atleta_id]?.minimo_para_valorizar ?? athlete.minimo_para_valorizar,
    status: getStatusName(athlete?.status_id ?? NULL),
    points: athlete.pontos_num,
    pointsAverage: athlete.media_num,
    price: athlete.preco_num,
    pointsAverageHome: athlete.gato_mestre?.media_pontos_mandante ?? 0,
    pointsAverageAway: athlete.gato_mestre?.media_pontos_visitante ?? 0,
    minutesPlayedAverage: athlete.gato_mestre?.media_minutos_jogados ?? 0,
    match: roundMatches[athlete.clube_id]
  }
}

export type MarketStatistics = MarketAthleteTableData[]

async function getMarketData() {
  const { atletas: athletes }: MarketData = await request(ENDPOINTS.MARKET)

  const jwtData = await getJwtToken()

  let athletesValuation = await getAthletesValuation(jwtData.jwt)

  if (
    typeof athletesValuation === 'object' &&
    athletesValuation &&
    'mensagem' in athletesValuation &&
    athletesValuation.mensagem === 'Expired'
  ) {
    athletesValuation = await getAthletesValuation(await getRefreshToken())
  }

  const roundMatches = await getMatchesData()

  const marketStatistics: MarketStatistics = []
  athletes.forEach((athlete) => {
    marketStatistics.push(
      marketAthleteTableDataFactory(
        athlete,
        roundMatches,
        athletesValuation as AthletesValuationResponseFromApi
      )
    )
  })

  return { marketStatistics }
}

export default async function Market() {
  const { marketStatistics } = await getMarketData()

  if (!marketStatistics) {
    return 'no market data'
  }

  return (
    <>
      <h1 className="text-2xl mb-4">Mercado</h1>
      <MarketContent athletes={marketStatistics} />
    </>
  )
}
