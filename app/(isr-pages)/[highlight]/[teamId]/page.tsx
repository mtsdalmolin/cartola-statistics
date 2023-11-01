import type { Metadata } from 'next'

import { Signature } from '@/app/common/components/signature'
import TeamStatisticsContent from '@/app/common/content/team-statistics'
import { Trophies } from '@/app/common/types/trophies'
import { ROUNDS, TEAMS } from '@/app/constants/data'
import { PARAM_TO_HIGHLIGHT } from '@/app/constants/highlight'
import { formatCartolaApiData } from '@/app/helpers/formatters/cartola'
import { ENDPOINTS, getRoundsData, getSubsData, request } from '@/app/services/cartola-api'
import { RoundData } from '@/app/services/types'
import edcBrand from '@/public/logo/twitter-card.png'
import { sql } from '@vercel/postgres'

import { find } from 'lodash'

export const metadata: Metadata = {
  title: 'Estatísticas do Cartola',
  description: 'Analise as estatísticas das suas escalações e veja o restrospecto do ano.',
  openGraph: {
    type: 'website',
    title: 'Estatísticas do Cartola',
    description: 'Analise as estatísticas das suas escalações e veja o restrospecto do ano.',
    images: [edcBrand.src]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Estatísticas do Cartola',
    description: 'Analise as estatísticas das suas escalações e veja o restrospecto do ano.',
    creator: '@mtsdalmolin',
    creatorId: '1686521332597477400',
    images: [edcBrand.src]
  }
}

async function teamHasStatisticStaticImage(teamId: number, highlight: string) {
  const teamImagesResult =
    await sql`SELECT image_url FROM share_static_images WHERE team_id = ${+teamId} ORDER BY id DESC`

  return !!teamImagesResult.rows.find((row) => row.image_url.includes(highlight))
}

export default async function TeamStatisticsStaticPage({
  params
}: {
  params: { highlight: string; teamId: string }
}) {
  const { highlight, teamId } = params

  const results = await Promise.allSettled<RoundData>(
    ROUNDS.map((round) => {
      return request(ENDPOINTS.TEAM_ROUND(teamId, round.toString()))
    })
  )

  if (results[0].status === 'fulfilled') {
    metadata.title = `EDC | ${results[0].value.time.nome}`
    if (metadata.twitter) {
      metadata.twitter.title = `Estatísticas do Cartola | ${results[0].value.time.nome}`
      metadata.twitter.description = `Veja as estatísticas do time ${results[0].value.time.nome}`

      if (highlight) {
        if (await teamHasStatisticStaticImage(+teamId, PARAM_TO_HIGHLIGHT[highlight])) {
          metadata.twitter.images = [
            `/api/image?teamId=${teamId}&highlight=${PARAM_TO_HIGHLIGHT[highlight]}`
          ]
        }
      }
    }

    if (metadata.openGraph) {
      metadata.openGraph.title = `Estatísticas do Cartola | ${results[0].value.time.nome}`
      metadata.openGraph.description = `Veja as estatísticas do time ${results[0].value.time.nome}`

      if (highlight) {
        if (await teamHasStatisticStaticImage(+teamId, PARAM_TO_HIGHLIGHT[highlight])) {
          metadata.openGraph.images = [
            `/api/image?teamId=${teamId}&highlight=${PARAM_TO_HIGHLIGHT[highlight]}`
          ]
        }
      }
    }
  }

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
    <div className="w-full pb-4">
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
      <Signature />
    </div>
  )
}
