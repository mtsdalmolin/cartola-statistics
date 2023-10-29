import type { Metadata } from 'next'

import TeamStatisticsContent from '@/app/common/content/team-statistics'
import { Trophies } from '@/app/common/types/trophies'
import { ROUNDS, TEAMS } from '@/app/constants/data'
import { formatCartolaApiData } from '@/app/helpers/formatters/cartola'
import { ENDPOINTS, getRoundsData, getSubsData, request } from '@/app/services/cartola-api'
import { RoundData } from '@/app/services/types'

import { find } from 'lodash'

export const metadata: Metadata = {
  title: 'Estatísticas do Cartola',
  description: 'Analise as estatísticas das suas escalações e veja o restrospecto do ano.'
}

export default async function TeamStatisticsStaticPage({ params }: { params: { teamId: string } }) {
  const { teamId } = params

  const results = await Promise.allSettled<RoundData>(
    ROUNDS.map((round) => {
      return request(ENDPOINTS.TEAM_ROUND(teamId, round.toString()))
    })
  )

  if (results[0].status === 'fulfilled') metadata.title = `EDC | ${results[0].value.time.nome}`

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

  return (
    <div className="w-full">
      <TeamStatisticsContent
        data={{
          athleteStatistics,
          benchStatistics,
          clubStatistics,
          positionsStatistics,
          trophies,
          teamInfo,
          rounds
        }}
      />
    </div>
  )
}
