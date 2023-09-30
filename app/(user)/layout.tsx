import '@/app/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'

import { RoundStartInfo } from '@/app/common/components/round-start-info'
import { TEAMS } from '@/app/constants/data'
import { ENDPOINTS, request } from '@/app/services/cartola-api'

const inter = Inter({ subsets: ['latin'] })

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Cartola Statistics',
  description: 'Site para analisar estatísticas que o cartola não utiliza.'
}

interface RoundInfo {
  nome_rodada: string
  fechamento: {
    dia: number
    mes: number
    ano: number
    hora: number
    minuto: number
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const marketStatus: RoundInfo = await request(ENDPOINTS.MARKET_STATUS)

  const dateStr = `${marketStatus.fechamento.mes}/${marketStatus.fechamento.dia}/${marketStatus.fechamento.ano} ${marketStatus.fechamento.hora}:${marketStatus.fechamento.minuto}:59`

  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="p-4 border-b-[1px]">
          <RoundStartInfo dateStr={dateStr} roundName={marketStatus.nome_rodada} />
        </header>
        <div className="flex min-h-screen">
          <aside className="border-r-[1px] border-r-white p-4 max-w-[250px]">
            <div className="sticky top-0 bottom-0 left-0">
              <nav className="flex flex-col">
                <Link className="my-2 hover:underline" href="/mercado">
                  Mercado
                </Link>
                {TEAMS.map((team) => (
                  <Link
                    key={team.id}
                    className="my-2 truncate hover:underline"
                    href={`/${team.slug}`}
                  >
                    {team.name}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>
          <main className="flex flex-col w-full py-8 px-12">{children}</main>
        </div>
      </body>
    </html>
  )
}