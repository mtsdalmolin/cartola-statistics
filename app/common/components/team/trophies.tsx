import Image from 'next/image'

import { type TrophiesReturnType } from '@/app/actions'
import { Flex } from '@/app/common/components/flex'
import { TrophiesData, Trophies as TrophiesEnum } from '@/app/common/types/trophies'
import { PHOTO_SIZE_FORMAT } from '@/app/constants/format'
import { UNEMPLOYED } from '@/app/constants/teams'
import { RoundData, RoundMatchesData } from '@/app/services/types'
import bagreBadge from '@/public/badges/bagre-badge.svg'
import cameFromBenchAndMadeTwelvePointsBadge from '@/public/badges/came-from-bench-and-made-twelve-points-badge.svg'
import defenseDidntSufferGoalsBadge from '@/public/badges/defense-didnt-suffer-goals-badge.svg'
import everyAthleteValuedBadge from '@/public/badges/every-athlete-valued-badge.svg'
import everyMidfielderHaveAssistsBadge from '@/public/badges/every-midfielder-have-assists-badge.svg'
import everyStrikerScoredBadge from '@/public/badges/every-striker-scored-badge.svg'
import fourPlayersMadeLessThanZeroPointsBadge from '@/public/badges/four-players-made-less-than-zero-points-badge.svg'
import futebolaoLeaguePlayerBadge from '@/public/badges/futebolao-league-badge.svg'
import goalsInThreeSectionsBadge from '@/public/badges/goals-in-three-sections-badge.svg'
import hattrickBadge from '@/public/badges/hat-trick-badge.svg'
import moreThanHundredFiftyPointsInRoundBadge from '@/public/badges/more-than-hundred-fifty-points-in-round-badge.svg'
import moreThanHundredPointsInRoundBadge from '@/public/badges/more-than-hundred-points-in-round-badge.svg'
import moreThanThirtyPointsWithOnePlayerBadge from '@/public/badges/more-than-thirty-points-with-one-player-badge.svg'
import reached200CartoletasBadge from '@/public/badges/reached-200-cartoletas-badge.svg'
import sevenPlayersScoredInRoundBadge from '@/public/badges/seven-players-scored-in-round-badge.svg'
import threePlayersMissedPenaltyBadge from '@/public/badges/three-players-missed-penalty-badge.svg'
import threePlayersRedCardedBadge from '@/public/badges/three-players-red-carded-badge.svg'
import { Avatar, HoverCard, Stack, Text } from '@mantine/core'
import { IconArrowBigDownFilled, IconArrowBigUpFilled } from '@tabler/icons-react'

import { isArray, isEmpty, isNil, maxBy, minBy } from 'lodash'

import { Athlete } from '../../types/athlete'
import { MatchVersus } from '../match-versus'

const TROPHIES_IMAGE = {
  [TrophiesEnum.CAME_FROM_BENCH_AND_MADE_12_POINTS]: cameFromBenchAndMadeTwelvePointsBadge,
  [TrophiesEnum.DEFENSE_DIDNT_SUFFER_GOALS]: defenseDidntSufferGoalsBadge,
  [TrophiesEnum.EVERY_ATHLETE_VALUED]: everyAthleteValuedBadge,
  [TrophiesEnum.EVERY_MIDFIELDER_HAVE_ASSISTS]: everyMidfielderHaveAssistsBadge,
  [TrophiesEnum.EVERY_STRIKER_SCORED]: everyStrikerScoredBadge,
  [TrophiesEnum.FOUR_OR_MORE_PLAYERS_MADE_LESS_THAN_0_POINTS]:
    fourPlayersMadeLessThanZeroPointsBadge,
  [TrophiesEnum.FUTEBOLAO_LEAGUE_PLAYER]: futebolaoLeaguePlayerBadge,
  [TrophiesEnum.GOALS_IN_THREE_SECTIONS]: goalsInThreeSectionsBadge,
  [TrophiesEnum.LESS_THAN_30_POINTS_IN_ROUND]: bagreBadge,
  [TrophiesEnum.MORE_THAN_100_POINTS_IN_ROUND]: moreThanHundredPointsInRoundBadge,
  [TrophiesEnum.MORE_THAN_150_POINTS_IN_ROUND]: moreThanHundredFiftyPointsInRoundBadge,
  [TrophiesEnum.MORE_THAN_30_POINTS_WITH_PLAYER_IN_ROUND]: moreThanThirtyPointsWithOnePlayerBadge,
  [TrophiesEnum.MORE_THAN_THREE_RED_CARDED_PLAYERS]: threePlayersRedCardedBadge,
  [TrophiesEnum.PLAYER_SCORED_HATTRICK]: hattrickBadge,
  [TrophiesEnum.REACHED_200_CARTOLETAS]: reached200CartoletasBadge,
  [TrophiesEnum.SEVEN_PLAYERS_SCORED]: sevenPlayersScoredInRoundBadge,
  [TrophiesEnum.THREE_PLAYERS_MISSED_PENALTY]: threePlayersMissedPenaltyBadge
}

const TROPHY_DESCRIPTION = {
  [TrophiesEnum.CAME_FROM_BENCH_AND_MADE_12_POINTS]:
    'Medalha de conquista por ter um jogador substituído por alguém do banco que fez mais de 12 pontos.',
  [TrophiesEnum.DEFENSE_DIDNT_SUFFER_GOALS]:
    'Medalha de conquista por ter escalado uma defesa que não sofreu gols.',
  [TrophiesEnum.EVERY_ATHLETE_VALUED]:
    'Medalha de conquista quando em uma escalação, todos os jogadores valorizaram.',
  [TrophiesEnum.EVERY_MIDFIELDER_HAVE_ASSISTS]:
    'Medalha de conquista quando em uma escalação, todos os meias deram assistências.',
  [TrophiesEnum.EVERY_STRIKER_SCORED]:
    'Medalha de conquista quando em uma escalação, todos os atacantes marcaram.',
  [TrophiesEnum.FOUR_OR_MORE_PLAYERS_MADE_LESS_THAN_0_POINTS]:
    'Medalha de conquista por ter escalado 4 ou mais jogadores fizeram menos de 0 pontos.',
  [TrophiesEnum.FUTEBOLAO_LEAGUE_PLAYER]:
    'Medalha de conquista por ter participado da liga Futebolão.',
  [TrophiesEnum.GOALS_IN_THREE_SECTIONS]:
    'Medalha de conquista por ter escalado jogadores dos 3 setores do campo que marcaram.',
  [TrophiesEnum.LESS_THAN_30_POINTS_IN_ROUND]:
    'Medalha de conquista por ter feito menos de 30 pontos em alguma rodada.',
  [TrophiesEnum.MORE_THAN_100_POINTS_IN_ROUND]:
    'Medalha de conquista quando atingiu 100 pontos ou mais em uma rodada.',
  [TrophiesEnum.MORE_THAN_150_POINTS_IN_ROUND]:
    'Medalha de conquista quando atingiu 150 pontos ou mais em uma rodada.',
  [TrophiesEnum.MORE_THAN_30_POINTS_WITH_PLAYER_IN_ROUND]:
    'Medalha de conquista quando pontuou mais de 30 com apenas um jogador.',
  [TrophiesEnum.MORE_THAN_THREE_RED_CARDED_PLAYERS]:
    'Medalha de conquista por ter escalado 3 ou mais jogadores que foram expulsos.',
  [TrophiesEnum.PLAYER_SCORED_HATTRICK]:
    'Medalha de conquista quando um jogador escalado fez 3 gols na partida.',
  [TrophiesEnum.REACHED_200_CARTOLETAS]: 'Medalha de conquista por ter atingido 200 cartoletas.',
  [TrophiesEnum.SEVEN_PLAYERS_SCORED]:
    'Medalha de conquista quando em uma escalação, 7 jogadores marcaram gols.',
  [TrophiesEnum.THREE_PLAYERS_MISSED_PENALTY]:
    'Medalha de conquista por ter escalado 3 ou mais jogadores que erraram pênaltis.'
}

function getCaptainFromRound(round: RoundData) {
  return round.atletas.find((athlete) => athlete.atleta_id === round.capitao_id)
}

function getHighestScorer(round: RoundData) {
  return maxBy(round.atletas, 'pontos_num')
}

function getLowestScorer(round: RoundData) {
  return minBy(round.atletas, 'pontos_num')
}

function getRoundValuation(round: RoundData) {
  return round.atletas.reduce((acc, athlete) => acc + athlete.variacao_num, 0)
}

function AthleteDetail({
  athlete,
  isCaptain,
  title
}: {
  athlete: Athlete
  isCaptain?: boolean
  title: string
}) {
  return (
    <Flex className="w-full" direction="column">
      <Text weight={600} size="xs">
        {title}
      </Text>
      <Flex className="w-full" align="center">
        <Flex className="relative grow-0">
          <Avatar
            src={athlete?.foto?.replace('FORMATO', PHOTO_SIZE_FORMAT) ?? ''}
            alt={athlete?.apelido ?? ''}
          />
        </Flex>
        <Flex className="w-max" align="center" justify="between">
          <Text className="truncate max-w-[80px]">{athlete?.apelido}</Text>
          <Text>
            {(isCaptain ? (athlete?.pontos_num ?? 0) * 1.5 : athlete?.pontos_num ?? 0).toFixed(1)}{' '}
            pts.
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

function TrophyDescription({
  data,
  description,
  matchesData
}: {
  data: TrophiesData[keyof TrophiesReturnType]
  description: string
  matchesData: RoundMatchesData
}) {
  if (isNil(data)) return null

  return (
    <Flex direction="column">
      <Text>{description}</Text>
      {isArray(data) ? (
        !isEmpty(data) ? (
          <Stack className="px-4 py-2 w-full">
            {data.map((athlete) => (
              <Flex key={athlete.atleta_id} align="center">
                <Flex direction="column">
                  <Text weight={600} size="xs">
                    Rodada {athlete.rodada_id}
                  </Text>
                  {athlete.clube_id === UNEMPLOYED ? (
                    <Text className="text-inherit" size="xs">
                      Atleta sem clube
                    </Text>
                  ) : (
                    <MatchVersus
                      match={matchesData[athlete.rodada_id][athlete.clube_id]}
                      badgeSize={18}
                      fontSize="xs"
                    />
                  )}
                </Flex>
                <Flex align="center" justify="end">
                  <Text className="truncate max-w-[70px]">{athlete.apelido}</Text>
                  <Avatar src={athlete.foto?.replace('FORMATO', PHOTO_SIZE_FORMAT) ?? ''} />
                </Flex>
              </Flex>
            ))}
          </Stack>
        ) : null
      ) : 'in' in data && 'out' in data ? (
        <Stack className="px-4 py-2 w-full">
          <Flex direction="column">
            <Text weight={600} size="xs">
              Rodada {data.in.rodada_id}
            </Text>
          </Flex>
          {Object.entries(data).map(([action, athlete]) => (
            <Flex key={athlete.atleta_id} align="center">
              <Flex align="center">
                {action === 'in' ? (
                  <IconArrowBigUpFilled className="text-palette-primary-700" />
                ) : (
                  <IconArrowBigDownFilled className="text-red-500" />
                )}
                <Avatar src={athlete.foto?.replace('FORMATO', PHOTO_SIZE_FORMAT) ?? ''} />
                <Text className="truncate max-w-[70px]">{athlete.apelido}</Text>
                <Text className="grow-[3] text-end">{athlete.pontos_num} pts.</Text>
              </Flex>
            </Flex>
          ))}
        </Stack>
      ) : (
        <Flex className="px-4 py-2 w-full" direction="column">
          <Flex className="w-full" align="center" justify="between">
            <Flex justify="between" direction="column">
              <Text weight={600} size="xs">
                Rodada {data.rodada_atual}
              </Text>
              <Text className="text-palette-primary-700" weight={600}>
                {data.pontos.toFixed(1)}{' '}
                <Text className="text-palette-neutral-200 inline">pts.</Text>
              </Text>
            </Flex>
            <Flex align="end" justify="between" direction="column">
              <Text weight={600} size="xs">
                Valorização
              </Text>
              <Text
                className={
                  getRoundValuation(data) > 0 ? 'text-palette-primary-700' : 'text-red-500'
                }
                weight={600}
              >
                {getRoundValuation(data) > 0 ? '+' : ''}
                {getRoundValuation(data).toFixed(1)}
              </Text>
            </Flex>
          </Flex>
          <AthleteDetail athlete={getCaptainFromRound(data)!} title="Capitão" isCaptain />
          <AthleteDetail athlete={getHighestScorer(data)!} title="Maior pontuador" />
          <AthleteDetail athlete={getLowestScorer(data)!} title="Menor pontuador" />
        </Flex>
      )}
    </Flex>
  )
}

function Trophy({
  data,
  matchesData,
  name
}: {
  data: TrophiesData[keyof TrophiesReturnType]
  matchesData: RoundMatchesData
  name: keyof typeof TROPHIES_IMAGE
}) {
  return (
    <HoverCard width={280} shadow="md">
      <HoverCard.Target>
        <Image
          className="hover:scale-150"
          src={TROPHIES_IMAGE[name]}
          width={128}
          height={128}
          alt={TROPHY_DESCRIPTION[name]}
        />
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <TrophyDescription
          data={data}
          description={TROPHY_DESCRIPTION[name]}
          matchesData={matchesData}
        />
      </HoverCard.Dropdown>
    </HoverCard>
  )
}

export function Trophies({
  matchesData,
  trophies
}: {
  matchesData: RoundMatchesData
  trophies: TrophiesReturnType
}) {
  return (
    <Flex
      className="flex-nowrap overflow-x-auto px-2 py-8 w-full mobile:justify-start"
      justify="center"
    >
      {Object.entries(trophies).map(([trophyName, trophyData]) => (
        <Trophy
          key={trophyName}
          data={trophyData}
          matchesData={matchesData}
          name={trophyName as keyof typeof TROPHIES_IMAGE}
        />
      ))}
    </Flex>
  )
}
