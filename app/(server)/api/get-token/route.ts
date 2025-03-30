import { NextResponse } from 'next/server'

import { sql } from '@vercel/postgres'

export async function GET() {
  const result = await sql`
    SELECT jwt
    FROM cartola_auth_token
    ORDER BY created_at DESC
    FETCH FIRST 1 ROWS ONLY
  `

  if (!result.rows) return NextResponse.json({ message: 'Failed to fetch token' }, { status: 400 })

  return NextResponse.json({ jwt: result.rows[0].jwt }, { status: 200 })
}
