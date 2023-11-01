import '@/app/globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Analytics } from '@vercel/analytics/react'

import { Main } from './common/components/main/main.client'
import { TeamInfoContextProvider } from './common/contexts/team-info-context.client'
const inter = Inter({ subsets: ['latin'] })

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Estatísticas do Cartola',
  description: 'Analise as estatísticas das suas escalações e veja o restrospecto do ano.'
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Main className="flex flex-col justify-center items-center px-4 m-auto max-w-[1200px]">
          <TeamInfoContextProvider>{children}</TeamInfoContextProvider>
        </Main>
        <Analytics />
      </body>
    </html>
  )
}
