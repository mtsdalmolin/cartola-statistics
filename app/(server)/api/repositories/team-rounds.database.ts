import { ENDPOINTS } from '@/app/services/cartola-api'
import { RoundData } from '@/app/services/types'
import { sql } from '@vercel/postgres'

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
