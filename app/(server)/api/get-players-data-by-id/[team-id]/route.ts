import { NextResponse } from 'next/server'

import { ENDPOINTS, request as makeRequest } from '@/app/services/cartola-api'
import { RoundData } from '@/app/services/types'
import { sql } from '@vercel/postgres'

import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'
import isNil from 'lodash/isNil'

type GetContext = {
  params: {
    [key: string]: string
  }
  searchParams: {
    [key: string]: string | string[]
  }
}

export const runtime = 'edge'

export async function GET(request: Request, context: GetContext) {
  const teamId = context.params['team-id']
  const { searchParams } = new URL(request.url)
  const round = searchParams.get('round')
  const year = searchParams.get('year')

  if (isArray(year) || isNil(year)) {
    return NextResponse.json({ message: 'couldnt process request' }, { status: 422 })
  }

  if (isArray(round) || isNil(round)) {
    return NextResponse.json({ message: 'couldnt process request' }, { status: 422 })
  }

  if (isNil(teamId)) {
    return NextResponse.json({ message: 'Couldnt process request' }, { status: 422 })
  }

  const cartolaEndpoint = ENDPOINTS.TEAM_ROUND(teamId, round)
  const cartolaEndpointWithYearPreffix = `${year}${ENDPOINTS.TEAM_ROUND(teamId.toString(), round)}`

  const cachedResponse = await sql`
    SELECT payload
    FROM cartola_request_cache
    WHERE endpoint = ${cartolaEndpointWithYearPreffix}
    FETCH FIRST 1 ROWS ONLY;
  `

  let result = {}
  let needsToFetchFromCartola = true

  if (!isNil(cachedResponse.rows) && !isEmpty(cachedResponse.rows)) {
    result = cachedResponse.rows[0].payload
    needsToFetchFromCartola = false
    console.log(`got data from neon cache for endpoint ${cartolaEndpointWithYearPreffix}`)
  }

  if (needsToFetchFromCartola) {
    result = await makeRequest<RoundData>(cartolaEndpoint, { cache: 'no-store' })
    console.log('fetching data from cartola api: ', cartolaEndpoint)

    const endpoint = `${year}${cartolaEndpoint}`
    // save only after first cartola round
    sql`
      INSERT INTO cartola_request_cache (payload, endpoint)
      VALUES (${JSON.stringify(result)}, ${endpoint})
    `
  }

  return NextResponse.json(result, { status: 200 })
}
