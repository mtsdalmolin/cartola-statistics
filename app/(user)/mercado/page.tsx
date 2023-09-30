import type { Metadata } from 'next'

import { MarketContent } from '../../common/components/market-content.client'
import { Athlete } from '../../common/types/athlete'
import { PHOTO_SIZE_FORMAT } from '../../constants/format'
import { NULL } from '../../constants/status'
import { FOOTBALL_TEAMS, FootballTeamsIds } from '../../constants/teams'
import { getPositionName } from '../../helpers/positions'
import { getStatusName } from '../../helpers/status'
import { getFootballTeamBadgeLink, getFootballTeamName } from '../../helpers/teams'
import { request } from '../../services/cartola-api'

export const metadata: Metadata = {
  title: 'Mercado',
  description: ''
}

// const ATHLETE_POINTS_ENDPOINT = (round: string) => `/atletas/pontuados/${round}`
const MARKET_ENDPOINT = '/atletas/mercado'
const MATCHES_ENDPOINT = '/partidas'

interface MarketData {
  atletas: Athlete[]
  clubes: (typeof FOOTBALL_TEAMS)[]
  posicoes: unknown[]
  status: unknown[]
}

interface MatchFroMApi {
  clube_visitante_id: number
  clube_casa_id: number
  partida_data: Date
}

interface Match {
  home: {
    clubBadgeUrl: string
    name: string
  }
  away: {
    clubBadgeUrl: string
    name: string
  }
}

interface MatchesData {
  partidas: MatchFroMApi[]
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

function marketAthleteTableDataFactory(
  athlete: Athlete,
  roundMatches: { [key: string]: Match }
): MarketAthleteTableData {
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
    minutesPlayedAverage: athlete.gato_mestre?.media_minutos_jogados ?? 0,
    match: roundMatches[athlete.clube_id]
  }
}

export type MarketStatistics = MarketAthleteTableData[]

async function getMatchesData() {
  const { partidas: matches }: MatchesData = await request(MATCHES_ENDPOINT)

  const roundMatches: { [key: string]: Match } = {}

  matches.forEach((match) => {
    const matchAssets = {
      home: {
        clubBadgeUrl: getFootballTeamBadgeLink(match.clube_casa_id as FootballTeamsIds),
        name: getFootballTeamName(match.clube_casa_id as FootballTeamsIds)
      },
      away: {
        clubBadgeUrl: getFootballTeamBadgeLink(match.clube_visitante_id as FootballTeamsIds),
        name: getFootballTeamName(match.clube_visitante_id as FootballTeamsIds)
      }
    }

    roundMatches[match.clube_casa_id] = matchAssets
    roundMatches[match.clube_visitante_id] = matchAssets
  })

  return roundMatches
}

async function getMarketData() {
  const { atletas: athletes }: MarketData = await request(MARKET_ENDPOINT)
  const roundMatches = await getMatchesData()

  const marketStatistics: MarketStatistics = []
  athletes.forEach((athlete) =>
    marketStatistics.push(marketAthleteTableDataFactory(athlete, roundMatches))
  )

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
