import { NextResponse } from 'next/server'

import { isNil } from 'lodash'

import { getTeamsWealthRankingData } from '../../repositories/wealth-ranking.database'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const year = searchParams.get('year')

  if (isNil(year) || year === 'undefined') {
    return NextResponse.json({ message: 'Bad format' }, { status: 422 })
  }

  const rankingData = await getTeamsWealthRankingData(year)

  return NextResponse.json(rankingData, { status: 200 })
}
