import type { Metadata } from 'next'

import { CrewContent } from '@/app/common/components/crew-content.client'
import { TEAMS } from '@/app/constants/data'
import { getPlayersTeamData } from '@/app/services/cartola-api'

import isNil from 'lodash/isNil'

export const metadata: Metadata = {
  title: 'Cartola Statistics',
  description: 'Site para analisar estatísticas que o cartola não utiliza.'
}

export default async function Team({ params }: { params: { teamSlug: string } }) {
  const teamData = TEAMS.find((team) => team.slug === params.teamSlug)

  if (isNil(teamData)) {
    return 'no data'
  }

  metadata.title = teamData.name

  const [athletes, bench, clubs, positions] = await getPlayersTeamData(
    teamData.slug,
    teamData.rounds
  )

  return (
    <>
      <h1 className="text-2xl mb-4">{teamData.name}</h1>
      <CrewContent athletes={athletes} bench={bench} clubs={clubs} positions={positions} />
    </>
  )
}
