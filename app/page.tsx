// import Image from 'next/image'

import Link from "next/link"

export const TEAMS = [
  {
    id: 25929996,
    slug: 'sociedade-esportiva-tacu',
    name: 'Sociedade Esportiva Tacu'
  },
  {
    id: 29367702,
    slug: '4-de-maio-futebol-e-cerveja',
    name: '4 de maio futebol e cerveja'
  },
  {
    id: 15159981,
    slug: 'valeimoveis',
    name: 'Valeimoveis'
  },
  {
    id: 112714,
    slug: 'real-egrete',
    name: 'Real Egrete'
  },
  {
    id: 47843698,
    slug: 'quarai-querencia-querida-fc',
    name: 'Quaraí Querência Querida FC'
  },
  {
    id: 28738386,
    slug: 'padariasilvalvto',
    name: 'Padariasilvalvto'
  },
]

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center p-12 gap-2">
      {TEAMS.map(team => 
        <Link key={team.id} href={`/${team.slug}`}>{team.name}</Link>
      )}
    </main>
  )
}
