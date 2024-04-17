import { RequestInit } from 'next/dist/server/web/spec-extension/request'

import { isEmpty } from 'lodash'

import { TeamsAutocompleteList } from '../common/components/forms/search-team-statistics'
import { type SeasonYears, TEAMS } from '../constants/data'
import { formatCartolaApiData } from '../helpers/formatters/cartola'
import { formatMatchData } from '../helpers/formatters/match'
import { MatchesData, RoundData, RoundMatchesData, SubsData } from './types'

export const CARTOLA_API = 'https://api.cartola.globo.com'

export const ENDPOINTS = {
  MARKET: '/atletas/mercado',
  MARKET_STATUS: '/mercado/status',
  MATCHES: '/partidas',
  MATCHES_BY_ID: (roundId: string) => `/partidas/${roundId}`,
  TEAM_ROUND: (teamId: string, round: string) => `/time/id/${teamId}/${round}`,
  SEARCH_TEAM_BY_NAME: (teamNameSearch: string) => `/busca?q=${teamNameSearch}`,
  GET_TEAM_SUBS: (teamId: string, round: string) => `/time/substituicoes/${teamId}/${round}`,
  AUTH: {
    GET_ATHLETES_VALUATION: '/auth/gatomestre/atletas'
  }
}

const REVALIDATION_TIME_IN_SECONDS = 5 * 60

export function request<TData>(endpoint: string, options: RequestInit = {}): Promise<TData> {
  const requestOptions = isEmpty(options)
    ? {
        next: {
          revalidate: REVALIDATION_TIME_IN_SECONDS
        }
      }
    : options

  return fetch(`${CARTOLA_API}${endpoint}`, requestOptions).then((res) => res.json())
}

export async function getPlayersTeamData({
  teamSlug,
  rounds,
  year
}: {
  teamSlug: string
  rounds: number[]
  year: SeasonYears
}) {
  const results = await Promise.allSettled<RoundData>(
    rounds.map((round) => {
      return fetch(
        `${process.env.NEXT_API_BASE_URL}/api/get-players-data/${teamSlug}?round=${round}&year=${year}`
      ).then((res) => res.json())
    })
  )

  const team = TEAMS.find((team) => team.slug === teamSlug)

  const roundMatches = await getRoundsData(rounds, year)
  const subs = await getSubsData(team!.id.toString(), rounds, year)

  if (!team) throw new Error('Forbidden')

  return formatCartolaApiData({ results, rounds: roundMatches, subs, year })
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

export async function searchTeamName(teamName: string): Promise<TeamsAutocompleteList[]> {
  const roundMatches = await fetch(`/api/search-team-names?q=${teamName}`).then((res) => res.json())

  return roundMatches
}

export async function getRoundsData(roundIds: number[], year: number): Promise<RoundMatchesData> {
  const roundMatches = await fetch(
    `${process.env.NEXT_API_BASE_URL}/api/get-rounds-data/${serializeQueryParams({
      rounds: roundIds,
      year
    })}`
  ).then((res) => res.json())

  return roundMatches
}

export async function getSubsData(
  teamId: string,
  roundIds: number[],
  year: number
): Promise<Record<string, SubsData[]>> {
  const subs = await fetch(
    `${process.env.NEXT_API_BASE_URL}/api/get-subs-data/${teamId}${serializeQueryParams({
      rounds: roundIds,
      year
    })}`
  ).then((res) => res.json())

  return subs
}

export async function getMatchesData() {
  const { partidas: matches }: MatchesData = await request(ENDPOINTS.MATCHES)

  return formatMatchData(matches)
}
