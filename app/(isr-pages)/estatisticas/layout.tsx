import '@/app/globals.css'
import { Suspense } from 'react'

import { Inter } from 'next/font/google'

import { LoadingFallback } from '@/app/common/components/loading-fallback'
import { Analytics } from '@vercel/analytics/react'
const inter = Inter({ subsets: ['latin'] })

export default async function StatisticsLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex flex-col justify-center items-center px-4 m-auto max-w-[1200px]">
          <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
        </main>
        <Analytics />
      </body>
    </html>
  )
}
