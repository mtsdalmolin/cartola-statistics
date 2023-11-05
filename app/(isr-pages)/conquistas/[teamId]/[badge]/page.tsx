import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { PARAM_TO_TROPHY, TROPHIES_IMAGE } from '@/app/constants/trophies'
import { ENDPOINTS, request } from '@/app/services/cartola-api'
import { RoundData } from '@/app/services/types'
import edcBrand from '@/public/logo/twitter-card.png'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type Props = {
  params: { badge: keyof typeof PARAM_TO_TROPHY; teamId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { badge, teamId } = params

  let images = []

  if (badge in PARAM_TO_TROPHY) images = [TROPHIES_IMAGE[PARAM_TO_TROPHY[badge]].src]
  else images.push(edcBrand.src)

  const result = await request<RoundData>(ENDPOINTS.TEAM_ROUND(teamId, '1'))

  const pageTitle = result ? `EDC | Medalhas de ${result.time.nome}` : 'Estatísticas do Cartola'
  const title = result
    ? `Estatísticas do Cartola | Medalhas de ${result.time.nome}`
    : 'Estatísticas do Cartola'
  const description = result
    ? `Veja as medalhas do time ${result.time.nome}`
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

export default async function AchievementBadgeSharePage({ params }: Props) {
  const { badge, teamId } = params

  if (!(badge && teamId)) redirect('/')

  return redirect(`/estatisticas/${teamId}?medalha=${badge}`)
}
