import { RoundData } from '@/app/services/types'
import { sql } from '@vercel/postgres'

export async function insertTeamRankingData(teamRoundPayload: RoundData, year: string) {
  const rankingAlreadyInDb = await sql`
    SELECT
      points
    FROM ranking_total_points
    WHERE
      team_id = ${teamRoundPayload.time.time_id} AND
      year = ${+year}
  `

  if (rankingAlreadyInDb.rows.length === 0) {
    const inserted = await sql`
      INSERT INTO ranking_total_points (team_id, team_name, team_badge, year, points)
      VALUES (
        ${teamRoundPayload.time.time_id},
        ${teamRoundPayload.time.nome},
        ${teamRoundPayload.time.url_escudo_png},
        ${+year},
        ${teamRoundPayload.pontos_campeonato}
      );
    `

    return inserted
  } else if (rankingAlreadyInDb.rows[0].pontos_campeonato < teamRoundPayload.pontos_campeonato) {
    const updated = await sql`
      UPDATE ranking_total_points
      SET
        team_name = ${teamRoundPayload.time.nome},
        team_badge = ${teamRoundPayload.time.url_escudo_png},
        points = ${teamRoundPayload.pontos_campeonato}
      WHERE
        team_id = ${teamRoundPayload.time.time_id} AND
        year = ${+year};
    `

    return updated
  }

  return null
}

export async function getTeamsRankingData(year: string) {
  const rankingDataResult = await sql`
    SELECT *
    FROM ranking_total_points
    WHERE year = ${+year}
    ORDER BY points DESC
    FETCH FIRST 50 ROWS ONLY;
  `

  return rankingDataResult.rows
}
