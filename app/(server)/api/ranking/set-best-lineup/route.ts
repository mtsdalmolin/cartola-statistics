import { NextResponse } from 'next/server'

import { isEmpty, isNil } from 'lodash'

import { insertLineupRankingData } from '../../repositories/best-lineup-ranking.database'
import { getTeamRoundsByYear } from '../../repositories/team-rounds.database'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const year = searchParams.get('year')

  if (isNil(year) || year === 'undefined') {
    return NextResponse.json({ message: 'Bad format' }, { status: 422 })
  }

  const bestLineupsData = await getTeamRoundsByYear(year)

  if (!isEmpty(bestLineupsData)) {
    await Promise.all([
      bestLineupsData.map(async (teamRound) => {
        if (!isNil(teamRound.payload.pontos)) {
          await insertLineupRankingData(teamRound.payload, year)
        }
      })
    ])
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}
