import Image from 'next/image'

import { PHOTO_SIZE_FORMAT } from '@/app/constants/format'
import { calculatePoints } from '@/app/helpers/formatters/cartola'
import { getPositionName } from '@/app/helpers/positions'
import { getFootballTeamBadgeLink, getFootballTeamName } from '@/app/helpers/teams'
import { RoundMatchesData } from '@/app/services/types'
import { Text, Tooltip } from '@mantine/core'
import { IconCircleLetterC } from '@tabler/icons-react'

import { bebasNeue } from '../../fonts/bebasNeue'
import { Athlete } from '../../types/athlete'
import { Flex } from '../flex'
import { RoundMatchesResult } from '../statistics/details/round-matches-result'

export function LineupListItem({
  athlete,
  captainId,
  matchesData,
  hideNamesOnMobile = true
}: {
  athlete: Athlete
  captainId: number
  matchesData?: RoundMatchesData
  hideNamesOnMobile?: boolean
}) {
  const isCaptain = athlete.atleta_id === captainId
  return (
    <Flex className="w-full pt-2" justify="between" align="center" gap="sm">
      <Flex className="max-w-sm" align="center">
        <Flex className="relative w-fit grow-0">
          <Image
            alt={athlete.apelido}
            src={(athlete?.foto ?? '').replace('FORMATO', PHOTO_SIZE_FORMAT)}
            width={60}
            height={60}
          />
          <Image
            className="absolute bottom-0 right-0"
            alt={getFootballTeamName(athlete.clube_id)}
            src={getFootballTeamBadgeLink(athlete.clube_id)}
            width={20}
            height={20}
          />
          {isCaptain ? (
            <Tooltip label="Capitão">
              <IconCircleLetterC
                className="absolute top-[-12px] left-0 text-amber-400"
                stroke={2}
              />
            </Tooltip>
          ) : null}
        </Flex>
        <Flex className={hideNamesOnMobile ? 'mobile:hidden' : ''} direction="column" gap="none">
          <Tooltip label={athlete.apelido}>
            <Text className="mobile:w-24 text-left text-xl truncate">{athlete.apelido}</Text>
          </Tooltip>
          <Flex>
            <Text>{getPositionName(athlete.posicao_id)} </Text>
          </Flex>
        </Flex>
      </Flex>
      {matchesData && (
        <RoundMatchesResult
          clubId={athlete.clube_id}
          matchesData={matchesData}
          roundIds={[athlete.rodada_id]}
        />
      )}
      <Flex className="grow-0" justify="end" align="end" direction="column" gap="none">
        <Text
          className={`${bebasNeue.className} mobile:text-5xl text-3xl ${
            athlete.pontos_num > 0 ? 'text-palette-primary-500' : ''
          } ${athlete.pontos_num < 0 ? 'text-red-500' : ''}`}
        >
          {calculatePoints(athlete, captainId).toFixed(1)}
        </Text>
        <Text className={`${bebasNeue.className} text-lg`}>
          {isCaptain ? `${athlete.pontos_num} x 1.5` : ''}
        </Text>
      </Flex>
    </Flex>
  )
}
