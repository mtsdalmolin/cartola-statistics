'use server'

import { revalidatePath } from 'next/cache'

import { ROUNDS } from './constants/data'
import { formatCartolaApiData } from './helpers/formatters/cartola'
import { ENDPOINTS, request } from './services/cartola-api'
import { RoundData } from './services/types'

export async function searchTeamId(prevState: any, formData: FormData) {
  try {
    const teamId = formData.get('teamId')!

    const results = await Promise.allSettled<RoundData>(
      ROUNDS.map((round) => {
        return request(ENDPOINTS.TEAM_ROUND(teamId.toString(), round.toString()))
      })
    )

    const data = formatCartolaApiData(results)

    revalidatePath('/')
    return { message: 'success', data }
  } catch (e) {
    console.log(e)
    return { message: 'error' }
  }
}
