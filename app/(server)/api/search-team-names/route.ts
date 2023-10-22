import { NextResponse } from 'next/server'

import { ENDPOINTS, request as makeRequest } from '@/app/services/cartola-api'
import { TeamFromSearchApi } from '@/app/services/types'

import { isNil } from 'lodash'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const searchQuery = searchParams.get('q')

  if (isNil(searchQuery)) {
    return NextResponse.json({ message: 'Bad format' }, { status: 422 })
  }

  const teamsFound = await makeRequest<TeamFromSearchApi[]>(
    ENDPOINTS.SEARCH_TEAM_BY_NAME(searchQuery)
  )
  const filteredTeamsFound = teamsFound
    .filter((team) => team.time_id)
    .map((team) => ({
      id: team.time_id,
      value: team.nome,
      subtitle: team.nome_cartola,
      badgeUrl: team.url_escudo_png
    }))

  return NextResponse.json(filteredTeamsFound, { status: 200 })
}
