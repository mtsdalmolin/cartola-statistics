import { RoundData } from '@/app/services/types'
import { sql } from '@vercel/postgres'

export async function insertTeamWealthRankingData(teamRoundPayload: RoundData, year: string) {
  const rankingAlreadyInDb = await sql`
    SELECT
      wealth
    FROM ranking_wealth
    WHERE
      team_id = ${teamRoundPayload.time.time_id} AND
      year = ${+year}
  `

  if (rankingAlreadyInDb.rows.length === 0) {
    const inserted = await sql`
      INSERT INTO ranking_wealth (team_id, team_name, team_badge, year, wealth)
      VALUES (
        ${teamRoundPayload.time.time_id},
        ${teamRoundPayload.time.nome},
        ${teamRoundPayload.time.url_escudo_png},
        ${+year},
        ${teamRoundPayload.patrimonio}
      );
    `

    return inserted
  } else if (rankingAlreadyInDb.rows[0].wealth < teamRoundPayload.patrimonio) {
    const updated = await sql`
      UPDATE ranking_wealth
      SET
        team_name = ${teamRoundPayload.time.nome},
        team_badge = ${teamRoundPayload.time.url_escudo_png},
        wealth = ${teamRoundPayload.patrimonio}
      WHERE
        team_id = ${teamRoundPayload.time.time_id} AND
        year = ${+year};
    `

    return updated
  }

  return null
}

export async function getTeamsWealthRankingData(year: number) {
  const rankingDataResult = await sql`
    SELECT *
    FROM ranking_wealth
    WHERE year = ${+year}
    ORDER BY wealth DESC
    FETCH FIRST 50 ROWS ONLY;
  `

  return rankingDataResult.rows
}
