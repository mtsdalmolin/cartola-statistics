import { NextResponse } from 'next/server'

import { put } from '@vercel/blob'
import { sql } from '@vercel/postgres'

export const runtime = 'edge'

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const filename = searchParams.get('filename')
  const teamId = searchParams.get('teamId')

  try {
    const blob = await put(`${filename}.jpg`, request.body!, {
      access: 'public'
    })

    await sql`INSERT INTO share_static_images (team_id, image_url) VALUES (${teamId}, ${blob.url})`

    return NextResponse.json({ success: true, message: 'Succeeded uploading ' })
  } catch (err: any) {
    return NextResponse.json(err, { status: 400 })
  }
}
