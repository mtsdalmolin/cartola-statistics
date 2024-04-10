{
  /* eslint-disable @next/next/no-img-element*/
}
import { ImageResponse } from 'next/og'
import { NextResponse } from 'next/server'

import { Trophies } from '@/app/common/types/trophies'
import { URLS } from '@/app/constants/url'
import assistWithGoalkeeperBadgePng from '@/public/badges/png/assist-with-goalkeeper-badge.png'
import bagreBadgePng from '@/public/badges/png/bagre-badge.png'
import cameFromBenchAndMadeTwelvePointsBadgePng from '@/public/badges/png/came-from-bench-and-made-twelve-points-badge.png'
import defenseDidntSufferGoalsBadgePng from '@/public/badges/png/defense-didnt-suffer-goals-badge.png'
import everyAthleteValuedBadgePng from '@/public/badges/png/every-athlete-valued-badge.png'
import everyMidfielderHaveAssistsBadgePng from '@/public/badges/png/every-midfielder-have-assists-badge.png'
import everyScheduledPlayerIsFromTheSameClubBadgePng from '@/public/badges/png/every-scheduled-player-is-from-the-same-club.png'
import everyStrikerScoredBadgePng from '@/public/badges/png/every-striker-scored-badge.png'
import fourPlayersMadeLessThanZeroPointsBadgePng from '@/public/badges/png/four-players-made-less-than-zero-points-badge.png'
import futebolaoLeagueBadgePng from '@/public/badges/png/futebolao-league-badge.png'
import goalsInThreeSectionsBadgePng from '@/public/badges/png/goals-in-three-sections-badge.png'
import hatTrickBadgePng from '@/public/badges/png/hat-trick-badge.png'
import moreThan30PointsWithOnePlayerBadgePng from '@/public/badges/png/more-than-30-points-with-one-player-badge.png'
import moreThanHundredFiftyPointsInRoundBadgePng from '@/public/badges/png/more-than-hundred-fifty-points-in-round-badge.png'
import moreThanHundredPointsInRoundBadgePng from '@/public/badges/png/more-than-hundred-points-in-round-badge.png'
import onePlayerOfEachClubBadgePng from '@/public/badges/png/one-player-of-each-club-badge.png'
import reached200CartoletasBadgePng from '@/public/badges/png/reached-200-cartoletas-badge.png'
import sevenPlayersScoredInRoundBadgePng from '@/public/badges/png/seven-players-scored-in-round-badge.png'
import threePlayersMissedPenaltyBadgePng from '@/public/badges/png/three-players-missed-penalty-badge.png'
import threeRedCardedPlayersBadgePng from '@/public/badges/png/three-players-red-carded-badge.png'
import edcBrand from '@/public/logo/brand.svg'
import edcLogo from '@/public/logo/edc-logo.svg'
import { sql } from '@vercel/postgres'

export const runtime = 'edge'

type GetContext = {
  params: {
    [key: string]: string
  }
  searchParams: {
    [key: string]: string | string[]
  }
}

const badgesProps = {
  [Trophies.ASSIST_WITH_GOALKEEPER]: {
    width: 160,
    height: 160,
    src: `${URLS.cartolaStatisticsPage}${assistWithGoalkeeperBadgePng.src}`
  },
  [Trophies.CAME_FROM_BENCH_AND_MADE_12_POINTS]: {
    width: 160,
    height: 160,
    src: `${URLS.cartolaStatisticsPage}${cameFromBenchAndMadeTwelvePointsBadgePng.src}`
  },
  [Trophies.DEFENSE_DIDNT_SUFFER_GOALS]: {
    width: 160,
    height: 160,
    src: `${URLS.cartolaStatisticsPage}${defenseDidntSufferGoalsBadgePng.src}`
  },
  [Trophies.EVERY_ATHLETE_VALUED]: {
    width: 160,
    height: 160,
    src: `${URLS.cartolaStatisticsPage}${everyAthleteValuedBadgePng.src}`
  },
  [Trophies.EVERY_MIDFIELDER_HAVE_ASSISTS]: {
    width: 160,
    height: 160,
    src: `${URLS.cartolaStatisticsPage}${everyMidfielderHaveAssistsBadgePng.src}`
  },
  [Trophies.EVERY_SCHEDULED_PLAYER_IS_FROM_THE_SAME_CLUB]: {
    width: 160,
    height: 160,
    src: `${URLS.cartolaStatisticsPage}${everyScheduledPlayerIsFromTheSameClubBadgePng.src}`
  },
  [Trophies.EVERY_STRIKER_SCORED]: {
    width: 160,
    height: 160,
    src: `${URLS.cartolaStatisticsPage}${everyStrikerScoredBadgePng.src}`
  },
  [Trophies.FOUR_OR_MORE_PLAYERS_MADE_LESS_THAN_0_POINTS]: {
    width: 160,
    height: 160,
    src: `${URLS.cartolaStatisticsPage}${fourPlayersMadeLessThanZeroPointsBadgePng.src}`
  },
  [Trophies.FUTEBOLAO_LEAGUE_PLAYER]: {
    width: 160,
    height: 160,
    src: `${URLS.cartolaStatisticsPage}${futebolaoLeagueBadgePng.src}`
  },
  [Trophies.GOALS_IN_THREE_SECTIONS]: {
    width: 130,
    height: 130,
    src: `${URLS.cartolaStatisticsPage}${goalsInThreeSectionsBadgePng.src}`
  },
  [Trophies.LESS_THAN_30_POINTS_IN_ROUND]: {
    width: 130,
    height: 130,
    src: `${URLS.cartolaStatisticsPage}${bagreBadgePng.src}`
  },
  [Trophies.MORE_THAN_100_POINTS_IN_ROUND]: {
    width: 160,
    height: 160,
    src: `${URLS.cartolaStatisticsPage}${moreThanHundredPointsInRoundBadgePng.src}`
  },
  [Trophies.MORE_THAN_150_POINTS_IN_ROUND]: {
    width: 160,
    height: 160,
    src: `${URLS.cartolaStatisticsPage}${moreThanHundredFiftyPointsInRoundBadgePng.src}`
  },
  [Trophies.MORE_THAN_30_POINTS_WITH_PLAYER_IN_ROUND]: {
    width: 160,
    height: 160,
    src: `${URLS.cartolaStatisticsPage}${moreThan30PointsWithOnePlayerBadgePng.src}`
  },
  [Trophies.MORE_THAN_THREE_RED_CARDED_PLAYERS]: {
    width: 160,
    height: 160,
    src: `${URLS.cartolaStatisticsPage}${threeRedCardedPlayersBadgePng.src}`
  },
  [Trophies.ONE_PLAYER_OF_EACH_CLUB]: {
    width: 160,
    height: 160,
    src: `${URLS.cartolaStatisticsPage}${onePlayerOfEachClubBadgePng.src}`
  },
  [Trophies.PLAYER_SCORED_HATTRICK]: {
    width: 160,
    height: 160,
    src: `${URLS.cartolaStatisticsPage}${hatTrickBadgePng.src}`
  },
  [Trophies.REACHED_200_CARTOLETAS]: {
    width: 160,
    height: 160,
    src: `${URLS.cartolaStatisticsPage}${reached200CartoletasBadgePng.src}`
  },
  [Trophies.SEVEN_PLAYERS_SCORED]: {
    width: 160,
    height: 160,
    src: `${URLS.cartolaStatisticsPage}${sevenPlayersScoredInRoundBadgePng.src}`
  },
  [Trophies.THREE_PLAYERS_MISSED_PENALTY]: {
    width: 160,
    height: 160,
    src: `${URLS.cartolaStatisticsPage}${threePlayersMissedPenaltyBadgePng.src}`
  }
}

const badgesPaddingTop = {
  'one-row': 150,
  'two-rows': 100,
  'three-rows': 60,
  'four-rows': 0
}

export async function GET(request: Request, context: GetContext) {
  const { searchParams } = new URL(request.url)
  const teamId = context.params['team-id']
  const roundId = searchParams.get('roundId')
  const year = searchParams.get('year')

  try {
    if (!(teamId && roundId))
      return NextResponse.json({ message: 'Couldnt process request' }, { status: 422 })

    const teamTrophiesResult = await sql`
      SELECT trophy_name
      FROM team_trophies
      WHERE team_id = ${teamId} AND
        year = ${year};
    `

    if (teamTrophiesResult.rowCount === 0)
      return NextResponse.json({ message: 'Not found' }, { status: 404 })

    const teamTrophies = teamTrophiesResult.rows.map((row) => row.trophy_name)

    const badges = Object.keys(badgesProps).filter((trophyName) =>
      teamTrophies.includes(trophyName)
    )
    let paddingTop = badgesPaddingTop['four-rows']
    const badgesRows = badges.length / 5

    if (badgesRows <= 1) paddingTop = badgesPaddingTop['one-row']
    else if (badgesRows <= 2) paddingTop = badgesPaddingTop['two-rows']
    else if (badgesRows <= 3) paddingTop = badgesPaddingTop['three-rows']

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            background: '#202833',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop
          }}
        >
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
          <img
            width="50"
            height="50"
            src={`${URLS.cartolaStatisticsPage}${edcLogo.src}`}
            alt="Logo do Estatísticas do Cartola"
            style={{ position: 'absolute', top: 50, left: 35 }}
          />
          <span
            style={{
              position: 'relative',
              display: 'flex',
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              flexBasis: '600px',
              gap: -65
            }}
          >
            {badges.map((trophyName) => (
              <img
                key={trophyName}
                width={badgesProps[trophyName as keyof typeof badgesProps].width}
                height={badgesProps[trophyName as keyof typeof badgesProps].height}
                src={badgesProps[trophyName as keyof typeof badgesProps].src}
                alt={trophyName}
              />
            ))}
          </span>
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
