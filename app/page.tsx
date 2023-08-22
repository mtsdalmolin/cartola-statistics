import Link from "next/link"
import { TEAMS } from "./constants/data"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-12 gap-2">
      <Link href="/mercado">Mercado</Link>
      {TEAMS.map(team => 
        <Link key={team.id} href={`/${team.slug}`}>{team.name}</Link>
      )}
    </main>
  )
}
