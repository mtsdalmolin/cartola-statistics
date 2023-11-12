import { NextResponse } from 'next/server'

import { ENDPOINTS, request as makeRequest } from '@/app/services/cartola-api'
import { SubsData } from '@/app/services/types'
import { sql } from '@vercel/postgres'

import { isEmpty, isNil, last, max } from 'lodash'

type GetContext = {
  params: {
    [key: string]: string
  }
  searchParams: {
    [key: string]: string | string[]
  }
}

export async function GET(request: Request, context: GetContext) {
  const teamId = context.params['team-id']
  const { searchParams } = new URL(request.url)
  const year = searchParams.get('year')

  if (isNil(year) || year === 'undefined') {
    return NextResponse.json({ message: 'Bad format' }, { status: 422 })
  }

  if (isNil(searchParams.get('rounds')) || searchParams.get('rounds') === 'undefined') {
    return NextResponse.json({ message: 'Bad format' }, { status: 422 })
  }

  const roundIds: number[] = []
  for (const [key, value] of searchParams) {
    if (key === 'rounds') roundIds.push(+value)
  }

  const cachedResults = await Promise.allSettled(
    roundIds.map((roundId) => {
      const endpoint = `${year}${ENDPOINTS.GET_TEAM_SUBS(teamId, roundId.toString())}`
      return sql`
        SELECT payload, endpoint
        FROM cartola_request_cache
        WHERE endpoint = ${endpoint}
        FETCH FIRST 1 ROWS ONLY;
      `
    })
  )

  const roundsCached: number[] = []
  const subs: { [key: string]: SubsData[] } = {}

  cachedResults.forEach((result) => {
    if (result.status === 'fulfilled' && !isEmpty(result.value.rows)) {
      const roundId = +last<string>(result.value.rows[0].endpoint.split('/'))!
      roundsCached.push(roundId)
      subs[roundId] = result.value.rows[0].payload
      return result.value.rows[0]
    }
    return null
  })

  const requestPromises: Record<string, Promise<SubsData[]>> = {}
  roundIds.forEach((roundId) => {
    if (roundId < max(roundsCached)!) return

    if (roundsCached.includes(roundId)) return

    requestPromises[roundId.toString()] = makeRequest(
      ENDPOINTS.GET_TEAM_SUBS(teamId, roundId.toString())
    )
  })

  const roundsToBeCached: number[] = []
  const results = await Promise.allSettled<SubsData[]>(
    Object.entries(requestPromises).map(([roundId, promise]) => {
      roundsToBeCached.push(+roundId)
      return promise
    })
  )

  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      if (result.value.length > 1) {
        const roundId = result.value[0].entrou.rodada_id
        subs[roundId] = result.value

        if (!roundsCached.includes(roundId)) {
          sql`
            INSERT INTO cartola_request_cache (payload, endpoint)
            VALUES (
              ${JSON.stringify(result.value)},
              ${year + ENDPOINTS.GET_TEAM_SUBS(teamId, roundId.toString())}
            )
          `
        }
      }
    }
  })

  return NextResponse.json(subs, { status: 200 })
}
