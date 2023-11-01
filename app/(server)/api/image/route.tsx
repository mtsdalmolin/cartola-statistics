import { ImageResponse, NextResponse } from 'next/server'

import { sql } from '@vercel/postgres'

import { isNil } from 'lodash'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const teamId = searchParams.get('teamId')
  const highlight = searchParams.get('highlight')

  try {
    if (!teamId) return NextResponse.json({ message: 'TeamId must be informed.' }, { status: 422 })

    const teamImages =
      await sql`SELECT image_url FROM share_static_images WHERE team_id = ${+teamId}`

    if (!teamImages.rows)
      return NextResponse.json({ message: 'Team images not found' }, { status: 404 })

    const highlightRow = teamImages.rows.find((row) => row.image_url.includes(highlight))
    if (!isNil(highlightRow) && !highlightRow.image_url)
      return NextResponse.json({ message: 'Highlight image not found' }, { status: 404 })

    const image = await fetch(highlightRow!.image_url as unknown as string).then((res) =>
      res.arrayBuffer()
    )

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            background: '#f6f6f6',
            width: '100%',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element*/}
          <img width="350" height="225" src={image as unknown as string} alt="" />
        </div>
      ),
      {
        width: 350,
        height: 225
      }
    )
  } catch (err: any) {
    return NextResponse.json(err, { status: 400 })
  }
}
