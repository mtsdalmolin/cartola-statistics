'use server'

import { revalidatePath } from 'next/cache'

import { ROUNDS } from './constants/data'
import { formatCartolaApiData } from './helpers/formatters/cartola'
import { ENDPOINTS, getRoundsData, request } from './services/cartola-api'
import { RoundData } from './services/types'

type FormatCartolaApiDataType = ReturnType<typeof formatCartolaApiData>

type NthChild<Archetype extends Array<unknown>, ChildIndex extends number> = Archetype[ChildIndex]

export type TrophiesReturnType = NthChild<FormatCartolaApiDataType, 4>

type GetTeamsStatisticsActionState = {
  message: 'success' | 'error' | null
  data?: {
    athleteStatistics: NthChild<FormatCartolaApiDataType, 0>
    benchStatistics: NthChild<FormatCartolaApiDataType, 1>
    clubStatistics: NthChild<FormatCartolaApiDataType, 2>
    positionsStatistics: NthChild<FormatCartolaApiDataType, 3>
    rounds: Awaited<ReturnType<typeof getRoundsData>>
    trophies: TrophiesReturnType
  } | null
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

    const rounds = await getRoundsData(ROUNDS)
    const [athleteStatistics, benchStatistics, clubStatistics, positionsStatistics, trophies] =
      formatCartolaApiData(results, rounds)

    revalidatePath('/')
    return {
      message: 'success',
      data: {
        athleteStatistics,
        benchStatistics,
        clubStatistics,
        positionsStatistics,
        rounds,
        trophies
      }
    }
  } catch (e) {
    console.log(e)
    return { message: 'error' }
  }
}
