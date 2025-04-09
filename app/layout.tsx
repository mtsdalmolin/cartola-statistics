import '@/app/globals.css'

import { Suspense } from 'react'
import { Monitoring } from 'react-scan/monitoring/next'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'

import edcBrand from '@/public/logo/twitter-card.png'
import { Analytics } from '@vercel/analytics/react'

import { LoadingFallback } from './common/components/loading-fallback'
import { Main } from './common/components/main/main.client'
import { PageClientTabs } from './common/components/tabs/page-tabs.client'
import { LineupsResultContextProvider } from './common/contexts/lineups-result-context.client'
import { SelectedYearContextProvider } from './common/contexts/selected-year-context.client'
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
      <head>
        <Script
          src="https://unpkg.com/react-scan/dist/install-hook.global.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className}>
        <Monitoring
          apiKey="ZvxPehnShaIXP0pY3XW0UMuKpbJWbcGt" // Safe to expose publically
          url="https://monitoring.react-scan.com/api/v1/ingest"
          commit={process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA} // optional but recommended
          branch={process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF} // optional but recommended
        />
        <Main className="flex flex-col justify-center items-center px-4 m-auto max-w-[1200px]">
          <PageClientTabs />
          <LineupsResultContextProvider>
            <TeamInfoContextProvider>
              <SelectedYearContextProvider>
                <Suspense fallback={<LoadingFallback fullScreen />}>{children}</Suspense>
              </SelectedYearContextProvider>
            </TeamInfoContextProvider>
          </LineupsResultContextProvider>
        </Main>
        <Analytics />
      </body>
    </html>
  )
}
