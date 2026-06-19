import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { getTeamRoundsData } from '@/app/(server)/api/repositories/team-rounds.database'
import { RedirectHomePageAlert } from '@/app/common/components/alert/redirect-home-page.client'
import { Signature } from '@/app/common/components/signature'
import TeamStatisticsContent from '@/app/common/content/team-statistics'
import { Trophies } from '@/app/common/types/trophies'
import { SEASONS, SECOND_TURN_ROUNDS, SeasonYears, TEAMS } from '@/app/constants/data'
import { PARAM_TO_HIGHLIGHT } from '@/app/constants/highlight'
import { registerTrophyEvent } from '@/app/helpers/analytics'
import { formatCartolaApiData } from '@/app/helpers/formatters/cartola'
import { ENDPOINTS, getRoundsData, getSubsData, request } from '@/app/services/cartola-api'
import { RoundData } from '@/app/services/types'
import edcBrand from '@/public/logo/twitter-card.png'
import { sql } from '@vercel/postgres'

import { find, last } from 'lodash'

export const runtime = 'edge'

type Props = {
  params: { highlight: string; teamId: string }
  searchParams: { link?: string; roundId?: string; year?: string }
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { highlight, teamId } = params
  const { roundId: roundIdFromSearchParams, year: yearFromSearchParams } = searchParams

  const result = await request<RoundData>(ENDPOINTS.TEAM_ROUND(teamId, '1'))

  const hasImage =
    highlight !== 'medalhas' && highlight !== 'estatisticas'
      ? await teamHasStatisticStaticImage(+teamId, PARAM_TO_HIGHLIGHT[highlight])
      : false

  const roundId = roundIdFromSearchParams ?? last(SECOND_TURN_ROUNDS)
  const year = yearFromSearchParams ?? '2023'

  const images = hasImage
    ? [
        `/api/image?teamId=${teamId}&highlight=${PARAM_TO_HIGHLIGHT[highlight]}&roundId=${roundId}&year=${year}`
      ]
    : highlight === 'medalhas'
    ? [`/api/image/badges/${teamId}?roundId=${roundId}&year=${year}`]
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
  const year = (searchParams.year ?? new Date().getFullYear()) as SeasonYears

  if (
    !(highlight in PARAM_TO_HIGHLIGHT) &&
    highlight !== 'estatisticas' &&
    highlight !== 'medalhas'
  ) {
    redirect('/')
  }

  const rounds = [...SEASONS[year].FIRST_TURN_ROUNDS, ...SEASONS[year].SECOND_TURN_ROUNDS]

  const results = await Promise.allSettled<RoundData>(
    rounds.map((round) => {
      return getTeamRoundsData(teamId.toString(), round.toString(), year.toString())
    })
  )

  const roundsData = await getRoundsData(rounds, year)
  const subs = await getSubsData(teamId.toString(), rounds, year)
  const [
    athleteStatistics,
    benchStatistics,
    clubStatistics,
    positionsStatistics,
    trophies,
    teamInfo,
    lineups
  ] = formatCartolaApiData({
    results,
    rounds: roundsData,
    subs,
    year: year
  })

  if (find(TEAMS, { id: Number(teamId) })) {
    registerTrophyEvent(Trophies.FUTEBOLAO_LEAGUE_PLAYER, {
      team: teamInfo
    })
    trophies[Trophies.FUTEBOLAO_LEAGUE_PLAYER] = []
  }

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
          rounds: roundsData,
          year
        }}
      />
      <Signature />
    </div>
  )
}
