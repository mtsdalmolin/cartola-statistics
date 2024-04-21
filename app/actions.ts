'use server'

import { revalidatePath } from 'next/cache'

import { track } from '@vercel/analytics/server'

import { find } from 'lodash'

import { Trophies } from './common/types/trophies'
import { SEASONS, SeasonYears, TEAMS } from './constants/data'
import { registerTrophyEvent } from './helpers/analytics'
import { formatCartolaApiData } from './helpers/formatters/cartola'
import { getRoundsData, getSubsData } from './services/cartola-api'
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
    lineups: NthChild<FormatCartolaApiDataType, 6>
    positionsStatistics: NthChild<FormatCartolaApiDataType, 3>
    rounds: Awaited<ReturnType<typeof getRoundsData>>
    trophies: TrophiesReturnType
    teamInfo: NthChild<FormatCartolaApiDataType, 5>
    year?: SeasonYears
  } | null
}

export async function getTeamStatistics(
  context: { year: SeasonYears },
  _: GetTeamsStatisticsActionState,
  formData: FormData
): Promise<GetTeamsStatisticsActionState> {
  try {
    if (!context.year) {
      throw new Error('context.year is required to run this action')
    }

    const year = context.year
    const teamId = formData.get('teamId')!
    const teamName = formData.get('teamName')!

    await track('action:getTeamStatistics', {
      teamId: teamId as unknown as string,
      teamName: teamName as unknown as string,
      year
    })

    const rounds = [...SEASONS[year].FIRST_TURN_ROUNDS, ...SEASONS[year].SECOND_TURN_ROUNDS]

    const results = await Promise.allSettled<RoundData>(
      rounds.map((round) => {
        return fetch(
          `${process.env.NEXT_API_BASE_URL}/api/get-players-data-by-id/${teamId}?round=${round}&year=${year}`
        ).then((res) => res.json())
      })
    )
    const roundsData = await getRoundsData(rounds, year)
    const subs = await getSubsData(teamId.toString(), rounds, year)

    const [
      athleteStatistics,
      benchStatistics,
      clubStatistics,
      positionsStatistics,
      trophies,
      teamInfo,
      lineups
    ] = formatCartolaApiData({ results, rounds: roundsData, subs, year })

    if (find(TEAMS, { id: Number(teamId) })) {
      registerTrophyEvent(Trophies.FUTEBOLAO_LEAGUE_PLAYER, {
        team: teamInfo
      })
      trophies[Trophies.FUTEBOLAO_LEAGUE_PLAYER] = []
    }

    revalidatePath('/')
    revalidatePath(`/estatisticas/${teamId}`)
    return {
      message: 'success',
      data: {
        athleteStatistics,
        benchStatistics,
        clubStatistics,
        positionsStatistics,
        rounds: roundsData,
        trophies,
        teamInfo: {
          ...teamInfo,
          id: +teamId
        },
        lineups,
        year
      }
    }
  } catch (e) {
    console.log(e)
    return { message: 'error' }
  }
}
