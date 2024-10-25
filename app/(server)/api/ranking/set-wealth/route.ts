import { NextResponse } from 'next/server'

import { isEmpty, isNil } from 'lodash'

import { getTeamsLatestRoundByYear } from '../../repositories/team-rounds.database'
import { insertTeamWealthRankingData } from '../../repositories/wealth-ranking.database'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const year = searchParams.get('year')
  const round = searchParams.get('round')

  if (isNil(year) || year === 'undefined') {
    return NextResponse.json({ message: 'Bad format' }, { status: 422 })
  }

  if (isNil(round) || round === 'undefined') {
    return NextResponse.json({ message: 'Bad format' }, { status: 422 })
  }

  const teamsLatestRound = await getTeamsLatestRoundByYear(year, round)

  const insertResponses: any[] = []

  if (!isEmpty(teamsLatestRound)) {
    teamsLatestRound.forEach(async (teamRound) => {
      if (!isNil(teamRound.payload.patrimonio))
        insertResponses.push(await insertTeamWealthRankingData(teamRound.payload, year))
    })
  }

  return NextResponse.json(insertResponses, { status: 200 })
}
