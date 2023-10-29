'use server'

import { revalidatePath } from 'next/cache'

import { track } from '@vercel/analytics/server'

import { find } from 'lodash'

import { Trophies } from './common/types/trophies'
import { ROUNDS, TEAMS } from './constants/data'
import { formatCartolaApiData } from './helpers/formatters/cartola'
import { ENDPOINTS, getRoundsData, getSubsData, request } from './services/cartola-api'
import { RoundData } from './services/types'

type FormatCartolaApiDataType = ReturnType<typeof formatCartolaApiData>

type NthChild<Archetype extends Array<unknown>, ChildIndex extends number> = Archetype[ChildIndex]

export type TrophiesReturnType = NthChild<FormatCartolaApiDataType, 4>

export interface GetTeamsStatisticsActionState {
  message: 'success' | 'error' | null
  data?: {
    athleteStatistics: NthChild<FormatCartolaApiDataType, 0>
    benchStatistics: NthChild<FormatCartolaApiDataType, 1>
    clubStatistics: NthChild<FormatCartolaApiDataType, 2>
    positionsStatistics: NthChild<FormatCartolaApiDataType, 3>
    rounds: Awaited<ReturnType<typeof getRoundsData>>
    trophies: TrophiesReturnType
    teamInfo: NthChild<FormatCartolaApiDataType, 5>
  } | null
}

export async function getTeamStatistics(
  _: GetTeamsStatisticsActionState,
  formData: FormData
): Promise<GetTeamsStatisticsActionState> {
  try {
    const teamId = formData.get('teamId')!
    const teamName = formData.get('teamName')!

    await track('action:getTeamStatistics', {
      teamId: teamId as unknown as string,
      teamName: teamName as unknown as string
    })

    const results = await Promise.allSettled<RoundData>(
      ROUNDS.map((round) => {
        return request(ENDPOINTS.TEAM_ROUND(teamId.toString(), round.toString()))
      })
    )

    const rounds = await getRoundsData(ROUNDS)
    const subs = await getSubsData(teamId.toString(), ROUNDS)
    const [
      athleteStatistics,
      benchStatistics,
      clubStatistics,
      positionsStatistics,
      trophies,
      teamInfo
    ] = formatCartolaApiData(results, rounds, subs)

    if (find(TEAMS, { id: Number(teamId) })) trophies[Trophies.FUTEBOLAO_LEAGUE_PLAYER] = []

    revalidatePath('/')
    revalidatePath(`/estatisticas/${teamId}`)
    return {
      message: 'success',
      data: {
        athleteStatistics,
        benchStatistics,
        clubStatistics,
        positionsStatistics,
        rounds,
        trophies,
        teamInfo
      }
    }
  } catch (e) {
    console.log(e)
    return { message: 'error' }
  }
}
