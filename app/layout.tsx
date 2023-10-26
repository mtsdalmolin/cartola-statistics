import '@/app/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Main } from '@/app/common/components/main/main.client'
import { Analytics } from '@vercel/analytics/react'
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
          {children}
        </Main>
        <Analytics />
      </body>
    </html>
  )
}
