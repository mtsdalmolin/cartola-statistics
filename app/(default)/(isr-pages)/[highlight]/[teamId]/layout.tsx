import '@/app/globals.css'
import { Suspense } from 'react'

import { Inter } from 'next/font/google'

import { LoadingFallback } from '@/app/common/components/loading-fallback'
import { LineupsResultContextProvider } from '@/app/common/contexts/lineups-result-context.client'
import { SelectedYearContextProvider } from '@/app/common/contexts/selected-year-context.client'
import { TeamInfoContextProvider } from '@/app/common/contexts/team-info-context.client'
import { Analytics } from '@vercel/analytics/react'
const inter = Inter({ subsets: ['latin'] })

export default async function StatisticsLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <main className="flex flex-col justify-center items-center px-4 m-auto max-w-[1200px]">
          <LineupsResultContextProvider>
            <TeamInfoContextProvider>
              <SelectedYearContextProvider>
                <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
              </SelectedYearContextProvider>
            </TeamInfoContextProvider>
          </LineupsResultContextProvider>
        </main>
        <Analytics />
      </body>
    </html>
  )
}
