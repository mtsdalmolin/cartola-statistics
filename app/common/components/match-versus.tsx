import Image from 'next/image'

import { Tooltip } from '@mantine/core'

import { Match } from '../types/match'
import { Flex } from './flex'

export function MatchVersus({ match, badgeSize = 30 }: { match: Match; badgeSize?: number }) {
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
      {match.result.home ?? ''}x{match.result.away ?? ''}
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
