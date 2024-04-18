import { ENDPOINTS } from '@/app/services/cartola-api'
import { RoundData } from '@/app/services/types'
import { sql } from '@vercel/postgres'

import { isNil } from 'lodash'

export async function getTeamRoundsData(
  teamId: string,
  round: string,
  year: string
): Promise<RoundData> {
  const cartolaEndpoint = `${year}${ENDPOINTS.TEAM_ROUND(teamId, round)}`

  const likeCartolaEndpointStatement = `%${cartolaEndpoint}%`

  const response = await sql`
    SELECT payload
    FROM cartola_request_cache
    WHERE endpoint LIKE ${likeCartolaEndpointStatement}
    FETCH FIRST 1 ROWS ONLY;
  `

  return response.rows[0].payload
}

export async function getTeamsLatestRoundByYear(year: string, round: string) {
  const likeCartolaEndpointStatement = `${year}/time/id/%`

  const response = await sql`
    SELECT
      payload,
      cast(substring(endpoint, '[0-9]?[0-9]$') AS INTEGER) AS round
    FROM cartola_request_cache
    WHERE
      endpoint LIKE ${likeCartolaEndpointStatement} AND
      SUBSTRING(endpoint, '[0-9]?[0-9]$') = ${round}
    ORDER BY round DESC;
  `

  if (isNil(response.rows[0].payload)) {
    throw new Error('No data')
  }

  return response.rows as unknown as { payload: RoundData; round: number }[]
}

export async function getTeamRoundsByYear(year: string) {
  const likeCartolaEndpointStatement = `${year}/time/id/%`

  const response = await sql`
    SELECT
      payload,
      cast(substring(endpoint, '[0-9]?[0-9]$') AS INTEGER) AS round
    FROM cartola_request_cache
    WHERE
      endpoint LIKE ${likeCartolaEndpointStatement}
    FETCH FIRST 500 ROWS ONLY;
  `

  if (response.rows.length === 0) {
    throw new Error('No data')
  }

  return response.rows as unknown as { payload: RoundData; round: number }[]
}
