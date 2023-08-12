import orderBy from 'lodash/orderBy'
import isNil from 'lodash/isNil'
import { TEAMS } from '../page'

const CARTOLA_API = 'https://api.cartola.globo.com/'

const ROUNDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]

const TEAM_ROUND_ENDPOINT = (teamId: string) => `time/id/${teamId}/:round`

interface Athlete {
  atleta_id: number
  apelido: string
}

interface RoundData {
  atletas: Athlete[]
  rodada_atual: number
}

async function getPlayersTeamData(endpoint: string) {
  const roundsData: RoundData[] = await Promise.all(
    ROUNDS.map(round =>
      fetch(`${CARTOLA_API}${endpoint.replace(':round', round.toString())}`)
        .then(res => res.json())
    )
  )

  const playersStatistics: Record<string, Athlete & { castTimes: number }> = {};

  roundsData.forEach(round => {
    const { atletas: athletes } = round
    athletes.forEach(athlete => {
      if (playersStatistics[athlete.atleta_id]) {
        playersStatistics[athlete.atleta_id].castTimes++
      } else {
        playersStatistics[athlete.atleta_id] = {
          atleta_id: athlete.atleta_id,
          apelido: athlete.apelido,
          castTimes: 1,
        }
      }
    })
  })

  return orderBy(playersStatistics, 'castTimes', 'desc')
}

function Athletes({ athlete }: { athlete: Athlete & { castTimes: number } }) {
  return (
    <>
      <span>{athlete.apelido}</span>{' '}
      <span>{athlete.castTimes}</span>
    </>
  )
}

export default async function Team({ params }: { params: { teamSlug: string } }) {
  const teamData = TEAMS.find(team => team.slug === params.teamSlug)

  if (isNil(teamData)) {
    return 'no data'
  }

  const data = await getPlayersTeamData(TEAM_ROUND_ENDPOINT(teamData.id.toString()))

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-xl">{teamData.name}</h1>
      {Object.entries(data).map(([athleteId, athlete]) => (
        <div key={athleteId}>
          <Athletes athlete={athlete} />
        </div>
      ))}
    </main>
  )
}
