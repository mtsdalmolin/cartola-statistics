import { NextResponse } from 'next/server'

import { TEAMS } from '@/app/constants/data'
import { ENDPOINTS, request as makeRequest } from '@/app/services/cartola-api'
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

export async function GET(request: Request, context: GetContext) {
  const teamData = TEAMS.find((team) => team.slug === context.params['team-slug'])
  const { searchParams } = new URL(request.url)
  const round = searchParams.get('round')
  const year = searchParams.get('year')

  if (isArray(round) || isNil(round)) {
    return NextResponse.json({ message: 'Bad format' }, { status: 422 })
  }

  if (isNil(teamData)) {
    return NextResponse.json({ message: 'Team not found' }, { status: 404 })
  }

  const cartolaEndpoint = `${year}${ENDPOINTS.TEAM_ROUND(teamData.id.toString(), round)}`
  const likeCartolaEndpointStatement = `%${cartolaEndpoint}%`

  const cachedResponse = await sql`
    SELECT payload
    FROM cartola_request_cache
    WHERE endpoint LIKE ${likeCartolaEndpointStatement}
    FETCH FIRST 1 ROWS ONLY;
  `

  let result
  let needsToFetchFromCartola = true

  if (!isNil(cachedResponse.rows) && !isEmpty(cachedResponse.rows)) {
    result = cachedResponse.rows[0].payload
    needsToFetchFromCartola = false
    console.log(`got data from neon cache for endpoint ${cartolaEndpoint}`)
  }

  if (needsToFetchFromCartola) {
    result = await makeRequest(cartolaEndpoint)

    console.log('fetching data from cartola api: ', cartolaEndpoint)

    const endpoint = `${year}${cartolaEndpoint}`

    sql`
      INSERT INTO cartola_request_cache (payload, endpoint)
      VALUES (${JSON.stringify(result)}, ${endpoint})
    `
  }

  return NextResponse.json(result, { status: 200 })
}
