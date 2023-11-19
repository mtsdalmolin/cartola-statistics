'use server'

import { track } from '@vercel/analytics/server'
import { sql } from '@vercel/postgres'

import { TeamInfo } from '../common/types/team'

export async function registerTrophyEvent(trophyName: string, data: Record<string, TeamInfo>) {
  const trackData = { team: data.team.name }
  const teamId = data.team.id

  const teamTrophies = await sql`
    SELECT trophy_name
    FROM team_trophies
    WHERE team_id = ${teamId} AND trophy_name = ${trophyName};
  `

  if (teamTrophies.rowCount === 0) {
    await sql`
      INSERT INTO team_trophies (team_id, trophy_name) VALUES (${teamId}, ${trophyName});
    `
  }

  await track(`trophy:${trophyName}`, trackData)
}
