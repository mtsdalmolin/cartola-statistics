import { NextResponse } from 'next/server'

import { Match } from '@/app/common/types/match'
import { formatMatchData } from '@/app/helpers/formatters/match'
import { ENDPOINTS, request as makeRequest } from '@/app/services/cartola-api'
import { MatchesData } from '@/app/services/types'
import { sql } from '@vercel/postgres'

import { isEmpty, isNil, last } from 'lodash'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const rounds = searchParams.get('rounds')
  const year = searchParams.get('year')

  if (isNil(year) || year === 'undefined') {
    return NextResponse.json({ message: 'Bad format' }, { status: 422 })
  }

  if (isNil(rounds) || rounds === 'undefined') {
    return NextResponse.json({ message: 'Bad format' }, { status: 422 })
  }

  const roundIds: number[] = []
  for (const [key, value] of searchParams) {
    if (key === 'rounds') roundIds.push(+value)
  }

  const cachedResults = await Promise.allSettled(
    roundIds.map((roundId) => {
      const endpoint = `${year}${ENDPOINTS.MATCHES_BY_ID(roundId.toString())}`
      return sql`
        SELECT payload, endpoint
        FROM cartola_request_cache
        WHERE endpoint = ${endpoint}
        FETCH FIRST 1 ROWS ONLY;
      `
    })
  )

  const roundsCached: number[] = []
  const roundMatches: { [key: string]: { [key: string]: Match } } = {}

  cachedResults.forEach((result) => {
    if (result.status === 'fulfilled' && !isEmpty(result.value.rows)) {
      const roundId = +last<string>(result.value.rows[0].endpoint.split('/'))!
      roundsCached.push(roundId)
      roundMatches[roundId] = formatMatchData(result.value.rows[0].payload.partidas)
      return result.value.rows[0]
    }
    return null
  })

  const requestPromises: Record<string, Promise<MatchesData>> = {}
  roundIds.forEach((roundId) => {
    if (roundsCached.includes(roundId)) return

    requestPromises[roundId.toString()] = makeRequest(ENDPOINTS.MATCHES_BY_ID(roundId.toString()))
  })

  const roundsToBeCached: number[] = []
  const results = await Promise.allSettled<MatchesData>(
    Object.entries(requestPromises).map(([roundId, promise]) => {
      roundsToBeCached.push(+roundId)
      return promise
    })
  )

  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      const roundId = result.value.rodada
      roundMatches[roundId] = formatMatchData(result.value.partidas)

      if (!roundsCached.includes(roundId)) {
        sql`
          INSERT INTO cartola_request_cache (payload, endpoint)
          VALUES (
            ${JSON.stringify(result.value)},
            ${year + ENDPOINTS.MATCHES_BY_ID(roundId.toString())}
          )
        `
      }
    }
  })

  return NextResponse.json(roundMatches, { status: 200 })
}
