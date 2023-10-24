import Image from 'next/image'

import { type TrophiesReturnType } from '@/app/actions'
import { Flex } from '@/app/common/components/flex'
import { TrophiesData, Trophies as TrophiesEnum } from '@/app/common/types/trophies'
import { PHOTO_SIZE_FORMAT } from '@/app/constants/format'
import { RoundData, RoundMatchesData } from '@/app/services/types'
import bagreBadge from '@/public/badges/bagre-badge.svg'
import futebolaoLeaguePlayerBadge from '@/public/badges/futebolao-league-badge.svg'
import hattrickBadge from '@/public/badges/hat-trick-badge.svg'
import moreThanHundredFiftyPointsInRoundBadge from '@/public/badges/more-than-hundred-fifty-points-in-round-badge.svg'
import moreThanHundredPointsInRoundBadge from '@/public/badges/more-than-hundred-points-in-round-badge.svg'
import moreThanThirtyPointsWithOnePlayerBadge from '@/public/badges/more-than-thirty-points-with-one-player-badge.svg'
import sevenPlayersScoredInRoundBadge from '@/public/badges/seven-players-scored-in-round-badge.svg'
import threePlayersMissedPenaltyBadge from '@/public/badges/three-players-missed-penalty-badge.svg'
import threePlayersRedCardedBadge from '@/public/badges/three-players-red-carded-badge.svg'
import { Avatar, HoverCard, Stack, Text } from '@mantine/core'

import { isArray, isEmpty, isNil, maxBy, minBy } from 'lodash'

import { Athlete } from '../../types/athlete'
import { MatchVersus } from '../match-versus'

const TROPHIES_IMAGE = {
  [TrophiesEnum.FUTEBOLAO_LEAGUE_PLAYER]: futebolaoLeaguePlayerBadge,
  [TrophiesEnum.LESS_THAN_30_POINTS_IN_ROUND]: bagreBadge,
  [TrophiesEnum.MORE_THAN_100_POINTS_IN_ROUND]: moreThanHundredPointsInRoundBadge,
  [TrophiesEnum.MORE_THAN_150_POINTS_IN_ROUND]: moreThanHundredFiftyPointsInRoundBadge,
  [TrophiesEnum.MORE_THAN_30_POINTS_WITH_PLAYER_IN_ROUND]: moreThanThirtyPointsWithOnePlayerBadge,
  [TrophiesEnum.MORE_THAN_THREE_RED_CARDED_PLAYERS]: threePlayersRedCardedBadge,
  [TrophiesEnum.PLAYER_SCORED_HATTRICK]: hattrickBadge,
  [TrophiesEnum.SEVEN_PLAYERS_SCORED]: sevenPlayersScoredInRoundBadge,
  [TrophiesEnum.THREE_PLAYERS_MISSED_PENALTY]: threePlayersMissedPenaltyBadge
}

const TROPHY_DESCRIPTION = {
  [TrophiesEnum.FUTEBOLAO_LEAGUE_PLAYER]:
    'Medalha de conquista por ter participado da liga Futebolão.',
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

function AthleteDetail({ athlete, title }: { athlete: Athlete; title: string }) {
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
          <Text>{athlete?.apelido}</Text>
          <Text>{(athlete?.pontos_num ?? 0).toFixed(1)} pts.</Text>
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
                  <MatchVersus
                    match={matchesData[athlete.rodada_id][athlete.clube_id]}
                    badgeSize={18}
                    fontSize="xs"
                  />
                </Flex>
                <Flex align="center" justify="end">
                  <Text className="truncate max-w-[70px]">{athlete.apelido}</Text>
                  <Avatar src={athlete.foto?.replace('FORMATO', PHOTO_SIZE_FORMAT) ?? ''} />
                </Flex>
              </Flex>
            ))}
          </Stack>
        ) : null
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
                {getRoundValuation(data)}
              </Text>
            </Flex>
          </Flex>
          <AthleteDetail athlete={getCaptainFromRound(data)!} title="Capitão" />
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
