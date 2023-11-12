import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { RedirectHomePageAlert } from '@/app/common/components/alert/redirect-home-page.client'
import { Signature } from '@/app/common/components/signature'
import TeamStatisticsContent from '@/app/common/content/team-statistics'
import { Trophies } from '@/app/common/types/trophies'
import { ROUNDS, SECOND_TURN_ROUNDS, TEAMS } from '@/app/constants/data'
import { PARAM_TO_HIGHLIGHT } from '@/app/constants/highlight'
import { formatCartolaApiData } from '@/app/helpers/formatters/cartola'
import { ENDPOINTS, getRoundsData, getSubsData, request } from '@/app/services/cartola-api'
import { RoundData } from '@/app/services/types'
import edcBrand from '@/public/logo/twitter-card.png'
import { sql } from '@vercel/postgres'

import { find, last } from 'lodash'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'edge'

type Props = {
  params: { highlight: string; teamId: string }
  searchParams: { link?: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { highlight, teamId } = params

  const result = await request<RoundData>(ENDPOINTS.TEAM_ROUND(teamId, '1'))

  const hasImage = await teamHasStatisticStaticImage(+teamId, PARAM_TO_HIGHLIGHT[highlight])

  const images = hasImage
    ? [
        `/api/image?teamId=${teamId}&highlight=${PARAM_TO_HIGHLIGHT[highlight]}&roundId=${last(
          SECOND_TURN_ROUNDS
        )}`
      ]
    : [edcBrand.src]

  const pageTitle = result ? `EDC | ${result.time.nome}` : 'Estatísticas do Cartola'
  const title = result ? `Estatísticas do Cartola | ${result.time.nome}` : 'Estatísticas do Cartola'
  const description = result
    ? `Veja as estatísticas do time ${result.time.nome}`
    : 'Analise as estatísticas das suas escalações e veja o restrospecto do ano.'

  return {
    title: pageTitle,
    description,
    openGraph: {
      type: 'website',
      title,
      description,
      images
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@mtsdalmolin',
      creatorId: '1686521332597477400',
      images
    }
  }
}

async function teamHasStatisticStaticImage(teamId: number, highlight: string) {
  const teamImagesResult =
    await sql`SELECT image_url FROM share_static_images WHERE team_id = ${+teamId} ORDER BY id DESC`

  return !!teamImagesResult.rows.find((row) => row.image_url.includes(highlight))
}

export default async function TeamStatisticsStaticPage({ params, searchParams }: Props) {
  const { highlight, teamId } = params
  const { link } = searchParams

  if (!(highlight in PARAM_TO_HIGHLIGHT) && highlight !== 'estatisticas') {
    redirect('/')
  }

  const results = await Promise.allSettled<RoundData>(
    ROUNDS.map((round) => {
      return request(ENDPOINTS.TEAM_ROUND(teamId, round.toString()))
    })
  )

  const currentYear = 2023
  const rounds = await getRoundsData(ROUNDS, currentYear)
  const subs = await getSubsData(teamId.toString(), ROUNDS, currentYear)
  const [
    athleteStatistics,
    benchStatistics,
    clubStatistics,
    positionsStatistics,
    trophies,
    teamInfo,
    lineups
  ] = formatCartolaApiData(results, rounds, subs)

  if (find(TEAMS, { id: Number(teamId) })) trophies[Trophies.FUTEBOLAO_LEAGUE_PLAYER] = []

  return (
    <div className="w-full pb-4">
      {link === 'share' ? <RedirectHomePageAlert /> : null}
      <TeamStatisticsContent
        data={{
          athleteStatistics,
          benchStatistics,
          clubStatistics,
          lineups,
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
