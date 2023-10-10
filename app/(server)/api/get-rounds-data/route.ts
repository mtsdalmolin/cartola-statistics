import { NextResponse } from 'next/server'

import { Match } from '@/app/common/types/match'
import { formatMatchData } from '@/app/helpers/formatters/match'
import { ENDPOINTS, request as makeRequest } from '@/app/services/cartola-api'
import { MatchesData } from '@/app/services/types'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  if (searchParams.get('rounds') === undefined) {
    return NextResponse.json({ message: 'Bad format' }, { status: 422 })
  }

  const roundIds: number[] = []
  for (const [key, value] of searchParams) {
    if (key === 'rounds') roundIds.push(+value)
  }

  const results = await Promise.allSettled<MatchesData>(
    roundIds.map((roundId) => {
      return makeRequest(ENDPOINTS.MATCHES_BY_ID(roundId.toString()))
    })
  )

  const roundMatches: { [key: string]: { [key: string]: Match } } = {}

  results.forEach((result, idx) => {
    if (result.status === 'fulfilled') {
      roundMatches[roundIds[idx]] = formatMatchData(result.value.partidas)
    }
  })

  return NextResponse.json(roundMatches, { status: 200 })
}
