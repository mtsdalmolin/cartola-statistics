import { NextResponse } from 'next/server'

import { put } from '@vercel/blob'
import { sql } from '@vercel/postgres'

export const runtime = 'edge'

const STATISTICS_MESSAGES: Record<string, string> = {
  'artillery': '%athlete% foi o artilheiro do meu cartola. ⚽',
  'best-away-player': 'O melhor jogador atuando fora de casa foi o %athlete%. 🏃‍♂️',
  'best-bench': 'O %athlete% foi o que mais pontuou e ficou no banco. 🥲',
  'best-coach': '%athlete% foi o melhor técnico no cartola. 👨‍💼',
  'best-home-player': 'O melhor jogador atuando em casa foi o %athlete%. 🏡',
  'defense-efficiency': 'O melhor em eficiência defensiva foi o %athlete%. 🥅',
  'finish-efficiency': 'O %athlete% foi o mais eficiente em finalizações. 🎯',
  'highest-average': 'Quem teve a maior média nas minhas escalações foi o %athlete%. 📈',
  'highest-scorer': '%athlete% foi quem mais pontuou nas minhas escalações. 💯',
  'least-valued-player': 'Quem mais me deu prejuízo foi o %athlete%. 📉',
  'lineups-per-club': 'O time que eu mais escalei jogadores foi o %club%.',
  'more-assists': 'O garçom do meu cartola foi o %athlete%. 🤵',
  'more-defenses': 'Quem agregou mais defesas foi o %athlete%. 🧤',
  'more-red-cards': '%athlete% foi expulso e me tirou 3 pontos, no mínimo. 🟥',
  'more-tackles': 'O líder de desarmes do meu cartola foi o %athlete%. 👮',
  'more-yellow-cards': 'Quem liderou em amarelos foi o %athlete%. 🟨',
  'most-offsided-player': 'O mais impedido no meu cartola foi o %athlete%. 🙋',
  'most-rounds-as-captain': 'Quem mais escalei como capitão foi o %athlete%. 🤴',
  'most-scheduled-player': 'O %athlete% foi o mais escalado no meu cartola. 🥇',
  'most-valued-player': 'Quem mais me rendeu cartoletas foi o %athlete%. 🤑',
  'points-per-club': 'O %club% foi o time que mais pontuei. 📈',
  'worst-goalkeeper': 'O mão de alface no meu cartola foi o %athlete%. 🥬'
}

const CLUB_STATS = ['lineups-per-club', 'points-per-club']

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const filename = searchParams.get('filename')
  const teamId = searchParams.get('teamId')
  const roundId = searchParams.get('roundId')

  if (!(filename && teamId && !!roundId))
    return NextResponse.json({ message: 'Couldnt process request' }, { status: 422 })

  try {
    const highlight = filename.split('_')

    const teamImages = await sql`
      SELECT image_url
      FROM share_static_images
      WHERE
        team_id = ${+teamId} AND
        round_id = ${roundId}
      ORDER BY
        id DESC
      `

    const teamAlreadyHasGeneratedImage = teamImages.rows.find((row) =>
      row.image_url.includes(highlight[0])
    )

    if (!teamAlreadyHasGeneratedImage) {
      const blob = await put(`${filename}.jpg`, request.body!, {
        access: 'public'
      })

      await sql`INSERT INTO share_static_images (team_id, image_url, round_id) VALUES (${teamId}, ${blob.url}, ${roundId})`
    }

    const message = CLUB_STATS.includes(highlight[0])
      ? STATISTICS_MESSAGES[highlight[0]].replace('%club%', highlight[1])
      : STATISTICS_MESSAGES[highlight[0]].replace('%athlete%', highlight[1])

    return NextResponse.json({ success: true, message })
  } catch (err: any) {
    return NextResponse.json(err, { status: 400 })
  }
}
