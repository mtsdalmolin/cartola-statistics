import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { type TrophiesReturnType } from '@/app/actions'
import { Flex } from '@/app/common/components/flex'
import { TrophiesData, Trophies as TrophiesEnum } from '@/app/common/types/trophies'
import { SEASONS, SeasonYears } from '@/app/constants/data'
import { PHOTO_SIZE_FORMAT } from '@/app/constants/format'
import { UNEMPLOYED } from '@/app/constants/teams'
import { PARAM_TO_TROPHY, TROPHIES_IMAGE, TROPHY_TO_PARAM } from '@/app/constants/trophies'
import {
  createTrophyBoardTwitterShareLink,
  createTrophyTwitterShareLink
} from '@/app/helpers/trophies'
import { RoundData, RoundMatchesData } from '@/app/services/types'
import { Avatar, HoverCard, Stack, Text } from '@mantine/core'
import { IconArrowBigDownFilled, IconArrowBigUpFilled, IconExternalLink } from '@tabler/icons-react'

import { isArray, isEmpty, isNil, last, maxBy, minBy, uniqueId } from 'lodash'

import { useSelectedYearContext } from '../../contexts/selected-year-context.client'
import { useTeamInfoContext } from '../../contexts/team-info-context.client'
import { Athlete } from '../../types/athlete'
import { MatchVersus } from '../match-versus'
import { CSSProperties } from 'react'

const TROPHY_DESCRIPTION = {
  [TrophiesEnum.ASSIST_WITH_GOALKEEPER]:
    'Medalha de conquista por ter escalado um goleiro que deu assistência.',
  [TrophiesEnum.CAME_FROM_BENCH_AND_MADE_12_POINTS]:
    'Medalha de conquista por ter um jogador substituído por alguém do banco que fez mais de 12 pontos.',
  [TrophiesEnum.DEFENSE_DIDNT_SUFFER_GOALS]:
    'Medalha de conquista por ter escalado uma defesa que não sofreu gols.',
  [TrophiesEnum.EVERY_ATHLETE_VALUED]:
    'Medalha de conquista quando em uma escalação, todos os jogadores valorizaram.',
  [TrophiesEnum.EVERY_MIDFIELDER_HAVE_ASSISTS]:
    'Medalha de conquista quando em uma escalação, todos os meias deram assistências.',
  [TrophiesEnum.EVERY_SCHEDULED_PLAYER_IS_FROM_THE_SAME_CLUB]:
    'Medalha de conquista por ter escalado todos os jogadores de um mesmo time.',
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
  [TrophiesEnum.ONE_PLAYER_OF_EACH_CLUB]:
    'Medalha de conquista por ter escalado um jogador de cada time.',
  [TrophiesEnum.PLAYER_SCORED_HATTRICK]:
    'Medalha de conquista quando um jogador escalado fez 3 gols na partida.',
  [TrophiesEnum.REACHED_200_CARTOLETAS]: 'Medalha de conquista por ter atingido 200 cartoletas.',
  [TrophiesEnum.SEVEN_PLAYERS_SCORED]:
    'Medalha de conquista quando em uma escalação, 7 jogadores marcaram gols.',
  [TrophiesEnum.THREE_PLAYERS_MISSED_PENALTY]:
    'Medalha de conquista por ter escalado 3 ou mais jogadores que erraram pênaltis.'
}

type TrophiesWithYear =
  | TrophiesEnum.ASSIST_WITH_GOALKEEPER
  | TrophiesEnum.CAME_FROM_BENCH_AND_MADE_12_POINTS
  | TrophiesEnum.DEFENSE_DIDNT_SUFFER_GOALS
  | TrophiesEnum.EVERY_MIDFIELDER_HAVE_ASSISTS
  | TrophiesEnum.EVERY_SCHEDULED_PLAYER_IS_FROM_THE_SAME_CLUB
  | TrophiesEnum.FUTEBOLAO_LEAGUE_PLAYER
  | TrophiesEnum.MORE_THAN_100_POINTS_IN_ROUND
  | TrophiesEnum.MORE_THAN_150_POINTS_IN_ROUND
  | TrophiesEnum.ONE_PLAYER_OF_EACH_CLUB
  | TrophiesEnum.REACHED_200_CARTOLETAS

const TROPHY_YEAR_STYLES: Record<TrophiesWithYear, CSSProperties> = {
  [TrophiesEnum.ASSIST_WITH_GOALKEEPER]: { bottom: 20, color: 'rgb(35, 54, 58)' },
  [TrophiesEnum.CAME_FROM_BENCH_AND_MADE_12_POINTS]: { bottom: 24, color: 'rgb(11, 55, 114)' },
  [TrophiesEnum.DEFENSE_DIDNT_SUFFER_GOALS]: { bottom: 24, color: 'rgb(241, 228, 189)' },
  [TrophiesEnum.EVERY_MIDFIELDER_HAVE_ASSISTS]: { bottom: 19, fontSize: 8, color: 'rgb(255, 248, 218)' },
  [TrophiesEnum.EVERY_SCHEDULED_PLAYER_IS_FROM_THE_SAME_CLUB]: { bottom: 26, color: 'rgb(255, 248, 218)' },
  [TrophiesEnum.FUTEBOLAO_LEAGUE_PLAYER]: { bottom: 32 },
  [TrophiesEnum.MORE_THAN_100_POINTS_IN_ROUND]: { bottom: 28 },
  [TrophiesEnum.MORE_THAN_150_POINTS_IN_ROUND]: { bottom: 28 },
  [TrophiesEnum.ONE_PLAYER_OF_EACH_CLUB]: { bottom: 26, color: '#efefef' },
  [TrophiesEnum.REACHED_200_CARTOLETAS]: { bottom: 20, color: '#000', fontSize: 8 },
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

export function ShareOnTwitterButtonLink({
  teamId,
  trophyParamName,
  type,
  year
}:
  | {
    type: 'trophy'
    teamId: string
    year: SeasonYears
    trophyParamName: keyof typeof PARAM_TO_TROPHY
  }
  | {
    type: 'trophyBoard'
    teamId: string
    year: SeasonYears
    trophyParamName?: never
  }) {
  return (
    <Link
      className="bg-palette-neutral-800 hover:bg-palette-neutral-700 rounded-md px-4"
      href={
        type === 'trophy'
          ? createTrophyTwitterShareLink({
            teamId,
            trophyParamName,
            year
          })
          : createTrophyBoardTwitterShareLink({
            teamId,
            roundId: +last([
              ...SEASONS[year].FIRST_TURN_ROUNDS,
              ...SEASONS[year].SECOND_TURN_ROUNDS
            ])!,
            year
          })
      }
      target="_blank"
    >
      <Flex className="h-[2.25rem]" align="center">
        <Text className="font-semibold" size="0.875rem">
          {type === 'trophy' ? 'Compartilhe no Twitter/X' : 'Compartilhar quadro de medalhas'}
        </Text>
        <IconExternalLink size={16} />
      </Flex>
    </Link>
  )
}

function TrophyDescription({
  data,
  description,
  matchesData,
  name
}: {
  data: TrophiesData[keyof TrophiesReturnType]
  description: string
  matchesData: RoundMatchesData
  name: keyof typeof TROPHIES_IMAGE
}) {
  const { teamId: teamIdParam } = useParams()
  const { teamInfo } = useTeamInfoContext()
  const { selectedYear } = useSelectedYearContext()

  const teamId = teamIdParam ?? teamInfo?.id

  if (isNil(data)) return null

  return (
    <Flex direction="column">
      <Text>{description}</Text>
      {isArray(data) ? (
        !isEmpty(data) ? (
          <Stack className="px-4 py-2 w-full">
            {data.map((athlete) => (
              <Flex key={uniqueId(athlete.atleta_id.toString())} align="center">
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
            <Flex key={uniqueId(athlete.atleta_id)} align="center">
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
                {data.pontos?.toFixed(1)}{' '}
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
      {!isArray(teamId) ? (
        <Flex className="w-full" justify="center" align="center">
          <ShareOnTwitterButtonLink
            type="trophy"
            teamId={teamId}
            trophyParamName={TROPHY_TO_PARAM[name]}
            year={selectedYear}
          />
        </Flex>
      ) : null}
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
  const { selectedYear } = useSelectedYearContext()
  return (
    <HoverCard width={280} shadow="md">
      <HoverCard.Target>
        <div className="relative hover:scale-150">
          <Image
            src={TROPHIES_IMAGE[name]}
            width={128}
            height={128}
            alt={TROPHY_DESCRIPTION[name]}
            tabIndex={0}
          />
          {name in TROPHY_YEAR_STYLES ? (
            <span
              className="absolute left-[50%] -translate-x-[50%] text-xs"
              style={TROPHY_YEAR_STYLES[name as TrophiesWithYear]}
            >{selectedYear}</span>
          ) : null}
        </div>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <TrophyDescription
          data={data}
          description={TROPHY_DESCRIPTION[name]}
          matchesData={matchesData}
          name={name}
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
      className="overflow-x-auto px-2 py-8 w-full mobile:justify-start mobile:flex-nowrap"
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
