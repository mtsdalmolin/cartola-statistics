'use server'

import { revalidatePath } from 'next/cache'

import { ROUNDS } from './constants/data'
import { formatCartolaApiData } from './helpers/formatters/cartola'
import { ENDPOINTS, getRoundsData, request } from './services/cartola-api'
import { RoundData } from './services/types'

type GetTeamsStatisticsActionState = {
  message: 'success' | 'error' | null
  data?:
    | [...ReturnType<typeof formatCartolaApiData>, Awaited<ReturnType<typeof getRoundsData>>]
    | null
}

export async function getTeamStatistics(
  _: GetTeamsStatisticsActionState,
  formData: FormData
): Promise<GetTeamsStatisticsActionState> {
  try {
    const teamId = formData.get('teamId')!

    const results = await Promise.allSettled<RoundData>(
      ROUNDS.map((round) => {
        return request(ENDPOINTS.TEAM_ROUND(teamId.toString(), round.toString()))
      })
    )

    const data = formatCartolaApiData(results)
    const rounds = await getRoundsData(ROUNDS)

    revalidatePath('/')
    return { message: 'success', data: [...data, rounds] }
  } catch (e) {
    console.log(e)
    return { message: 'error' }
  }
}
