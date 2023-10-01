import '@/app/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Main } from '@/app/common/components/main/main.client'

const inter = Inter({ subsets: ['latin'] })

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Cartola Statistics',
  description: 'Site para analisar estatísticas que o cartola não utiliza.'
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Main className="w-full px-8">{children}</Main>
      </body>
    </html>
  )
}
