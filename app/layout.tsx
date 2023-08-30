import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { TEAMS } from './constants/data'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cartola Statistics',
  description: 'Site para analisar estatísticas que o cartola não utiliza.',
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <aside className="fixed top-0 bottom-0 lg:left-0 border-r-[1px] border-r-white px-4 py-8 max-w-[250px]">
          <nav className="flex flex-col">
            <Link className="my-2 hover:underline" href="/mercado">Mercado</Link>
            {TEAMS.map(team => 
              <Link
                key={team.id}
                className="my-2 truncate hover:underline"
                href={`/${team.slug}`}
              >
                {team.name}
              </Link>
            )}
          </nav>
        </aside>
        <main className="min-h-screen items-center py-8 px-12 ml-[250px]">
          {children}
        </main>
      </body>
    </html>
  )
}
