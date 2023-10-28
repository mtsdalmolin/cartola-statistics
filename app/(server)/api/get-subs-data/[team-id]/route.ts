import { NextResponse } from 'next/server'

import { ENDPOINTS, request as makeRequest } from '@/app/services/cartola-api'
import { SubsData } from '@/app/services/types'

type GetContext = {
  params: {
    [key: string]: string
  }
  searchParams: {
    [key: string]: string | string[]
  }
}

export async function GET(request: Request, context: GetContext) {
  const teamId = context.params['team-id']
  const { searchParams } = new URL(request.url)

  if (searchParams.get('rounds') === undefined) {
    return NextResponse.json({ message: 'Bad format' }, { status: 422 })
  }

  const roundIds: number[] = []
  for (const [key, value] of searchParams) {
    if (key === 'rounds') roundIds.push(+value)
  }

  const results = await Promise.allSettled<SubsData>(
    roundIds.map((roundId) => {
      return makeRequest(ENDPOINTS.GET_TEAM_SUBS(teamId, roundId.toString()))
    })
  )

  const subs: { [key: string]: SubsData } = {}

  results.forEach((result, idx) => {
    if (result.status === 'fulfilled') {
      subs[roundIds[idx]] = result.value
    }
  })

  return NextResponse.json(subs, { status: 200 })
}
