import { RoundData } from '@/app/services/types'
import { sql } from '@vercel/postgres'

export async function insertLineupRankingData(teamRoundPayload: RoundData, year: string) {
  const rankingAlreadyInDb = await sql`
    SELECT
      team_id
    FROM ranking_best_lineup
    WHERE
      team_id = ${teamRoundPayload.time.time_id} AND
      year = ${+year} AND
      round = ${teamRoundPayload.rodada_atual}
  `

  if (rankingAlreadyInDb.rows.length === 0) {
    const inserted = await sql`
      INSERT INTO ranking_best_lineup
        (team_id, team_name, team_badge, year, round, payload)
      VALUES (
        ${teamRoundPayload.time.time_id},
        ${teamRoundPayload.time.nome},
        ${teamRoundPayload.time.url_escudo_png},
        ${+year},
        ${teamRoundPayload.rodada_atual},
        ${JSON.stringify(teamRoundPayload)}
      );
    `

    return inserted
  }

  const updated = await sql`
    UPDATE ranking_best_lineup
    SET
      team_name = ${teamRoundPayload.time.nome},
      team_badge = ${teamRoundPayload.time.url_escudo_png},
      payload = ${JSON.stringify(teamRoundPayload)}
    WHERE
      team_id = ${teamRoundPayload.time.time_id} AND
      year = ${+year} AND
      round = ${+teamRoundPayload.rodada_atual}
  `

  return updated
}

export async function getTeamsLineupRankingData(year: string) {
  const rankingDataResult = await sql`
    SELECT
      CAST(TO_JSONB(payload->'pontos') AS REAL) points,
      team_name,
      team_badge,
      team_id,
      payload
    FROM ranking_best_lineup
    WHERE
      year = ${year}
    ORDER BY points DESC
    FETCH FIRST 50 ROWS ONLY;
  `

  return rankingDataResult.rows
}
