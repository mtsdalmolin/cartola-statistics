import Image from 'next/image'

import { Text, Tooltip } from '@mantine/core'

import { Match } from '../types/match'
import { Flex } from './flex'

export function MatchVersus({
  match,
  badgeSize = 30,
  fontSize = 'md',
  showResult = true
}: {
  showResult?: boolean
  match?: Match
  badgeSize?: number
  fontSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}) {
  if (!match) return 'Sem partida'
  return (
    <Flex align="center">
      <Tooltip label={match.home.name}>
        <Image
          alt={match.home.name}
          src={match.home.clubBadgeUrl}
          width={badgeSize}
          height={badgeSize}
        />
      </Tooltip>
      <Text size={fontSize}>
        {showResult ? match.result.home ?? '0' : ''} x {showResult ? match.result.away ?? '0' : ''}
      </Text>
      <Tooltip label={match.away.name}>
        <Image
          alt={match.away.name}
          src={match.away.clubBadgeUrl}
          width={badgeSize}
          height={badgeSize}
        />
      </Tooltip>
    </Flex>
  )
}
