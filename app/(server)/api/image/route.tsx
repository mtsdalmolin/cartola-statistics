import { ImageResponse, NextResponse } from 'next/server'

import { URLS } from '@/app/constants/url'
import edcBrand from '@/public/logo/brand.svg'
import edcLogo from '@/public/logo/edc-logo.svg'
import { sql } from '@vercel/postgres'

import { isNil } from 'lodash'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const teamId = searchParams.get('teamId')
  const highlight = searchParams.get('highlight')
  const roundId = searchParams.get('roundId')

  try {
    if (!(teamId && roundId && highlight))
      return NextResponse.json({ message: 'Couldnt process request' }, { status: 422 })

    const teamImages = await sql`
        SELECT image_url
        FROM share_static_images
        WHERE
          team_id = ${+teamId} AND
          round_id = ${+roundId}
        ORDER BY id DESC`

    if (!teamImages.rows)
      return NextResponse.json({ message: 'Team images not found' }, { status: 404 })

    const highlightRow = teamImages.rows.find((row) => row.image_url.includes(highlight))
    if (!isNil(highlightRow) && !highlightRow.image_url)
      return NextResponse.json({ message: 'Team images not found' }, { status: 404 })

    const image = await fetch(highlightRow!.image_url as unknown as string).then((res) =>
      res.arrayBuffer()
    )

    return new ImageResponse(
      (
        <div
          style={{
            position: 'relative',
            display: 'flex',
            background: '#202833',
            width: '100%',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element*/}
          <img
            src={image as unknown as string}
            alt={highlight}
            style={{ paddingTop: 40, paddingRight: 50, paddingBottom: 40, paddingLeft: 55 }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element*/}
          <img
            width="600"
            height="386"
            src={`${URLS.cartolaStatisticsPage}${edcBrand.src}`}
            alt="Logo do Estatísticas do Cartola"
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.05
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element*/}
          <img
            width="50"
            height="50"
            src={`${URLS.cartolaStatisticsPage}${edcLogo.src}`}
            alt="Logo do Estatísticas do Cartola"
            style={{ position: 'absolute', top: 50, left: 50 }}
          />
        </div>
      ),
      {
        width: 700,
        height: 450
      }
    )
  } catch (err: any) {
    return NextResponse.json(err, { status: 400 })
  }
}
