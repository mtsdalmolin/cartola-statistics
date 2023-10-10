import { RequestInit } from 'next/dist/server/web/spec-extension/request'

import { ClubStatistics, CrewStatistics } from '../common/types/athlete'
import { Match } from '../common/types/match'
import { PositionsStatistics } from '../common/types/position'
import { formatCartolaApiData } from '../helpers/formatters/cartola'
import { formatMatchData } from '../helpers/formatters/match'
import { MatchesData, RoundData } from './types'

export const CARTOLA_API = 'https://api.cartola.globo.com'

export const ENDPOINTS = {
  MARKET: '/atletas/mercado',
  MARKET_STATUS: '/mercado/status',
  MATCHES: '/partidas',
  MATCHES_BY_ID: (roundId: string) => `/partidas/${roundId}`,
  TEAM_ROUND: (teamId: string, round: string) => `/time/id/${teamId}/${round}`
}

const REVALIDATION_TIME_IN_SECONDS = 5 * 60

export function request(endpoint: string, options: RequestInit = {}) {
  const requestOptions = options ?? {
    next: {
      revalidate: REVALIDATION_TIME_IN_SECONDS
    }
  }

  return fetch(`${CARTOLA_API}${endpoint}`, requestOptions).then((res) => res.json())
}

export async function getPlayersTeamData(
  teamSlug: string,
  rounds: number[]
): Promise<[CrewStatistics, CrewStatistics, ClubStatistics, PositionsStatistics]> {
  const results = await Promise.allSettled<RoundData>(
    rounds.map((round) => {
      return fetch(
        `${process.env.NEXT_API_BASE_URL}/api/get-players-data/${teamSlug}?round=${round}`
      ).then((res) => res.json())
    })
  )

  return formatCartolaApiData(results)
}

function serializeQueryParams(queryParams: {
  [key: string]: number | string | number[] | string[]
}) {
  return Object.entries(queryParams).reduce((acc, [pKey, pValue]) => {
    if (Array.isArray(pValue)) {
      pValue.forEach((p) => {
        if (acc === '?') acc += `${pKey}=${p}`
        else acc += `&${pKey}=${p}`
      })
    } else {
      if (acc === '?') acc += `${pKey}=${pValue}`
      else acc += `&${pKey}=${pValue}`
    }
    return acc
  }, '?')
}

export async function getRoundsData(roundIds: number[]) {
  const roundMatches = await fetch(
    `/api/get-rounds-data/${serializeQueryParams({
      rounds: roundIds
    })}`
  ).then((res) => res.json())

  return roundMatches
}

export async function getMatchesData() {
  const { partidas: matches }: MatchesData = await request(ENDPOINTS.MATCHES)

  return formatMatchData(matches)
}
