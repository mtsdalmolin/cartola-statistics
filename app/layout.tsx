import '@/app/globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import edcBrand from '@/public/logo/twitter-card.png'
import { Analytics } from '@vercel/analytics/react'

import { Main } from './common/components/main/main.client'
import { TeamInfoContextProvider } from './common/contexts/team-info-context.client'

const inter = Inter({ subsets: ['latin'] })

export const dynamic = 'force-dynamic'

const title = 'Estatísticas do Cartola'
const description = 'Analise as estatísticas das suas escalações e veja o restrospecto do ano.'
export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: 'website',
    title,
    description,
    images: [edcBrand.src]
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    creator: '@mtsdalmolin',
    creatorId: '1686521332597477400',
    images: [edcBrand.src]
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Main className="flex flex-col justify-center items-center px-4 m-auto max-w-[1200px]">
          <TeamInfoContextProvider>{children}</TeamInfoContextProvider>
        </Main>
        <Analytics />
      </body>
    </html>
  )
}
