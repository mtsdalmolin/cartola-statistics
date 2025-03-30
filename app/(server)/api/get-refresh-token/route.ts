import { NextResponse } from 'next/server'

import { refreshToken } from '@/app/services/cartola-api'
import { sql } from '@vercel/postgres'

export const runtime = 'edge'

export async function GET() {
  const result = await sql`
    SELECT jwt
    FROM cartola_auth_token
    ORDER BY created_at DESC
    FETCH FIRST 1 ROWS ONLY
  `

  const newJwt = await refreshToken(result.rows[0].jwt)

  if (!newJwt.access_token)
    return NextResponse.json({ message: 'Failed to update token' }, { status: 400 })

  const a = await sql`
    INSERT INTO cartola_auth_token(jwt)
    VALUES(${newJwt.access_token})
  `

  return NextResponse.json(a, { status: 200 })
}
