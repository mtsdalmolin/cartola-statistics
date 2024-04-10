import { RoundMatchesData } from '@/app/services/types'

import { uniqueId } from 'lodash'

import { Flex } from '../../flex'
import { MatchVersus } from '../../match-versus'

export function RoundMatchesResult({
  clubId,
  roundIds,
  matchesData,
  isAnimated = false
}: {
  clubId: number
  roundIds: number[]
  matchesData: RoundMatchesData
  isAnimated?: boolean
}) {
  return (
    <Flex
      className={`min-w-[130px] w-min max-h-60 ${isAnimated ? 'flex-nowrap overflow-hidden' : ''}`}
      direction="column"
    >
      <div className={isAnimated ? 'h-max animate-scrollVertically hover:pause-animation' : ''}>
        {roundIds.map((roundId) => (
          <Flex key={uniqueId(roundId.toString())} direction="column">
            <span className="text-xs">Rodada {roundId}</span>
            <MatchVersus match={matchesData[roundId][clubId]} badgeSize={25} />
          </Flex>
        ))}
        {isAnimated
          ? roundIds.map((roundId) => (
              <Flex aria-hidden="true" key={uniqueId(roundId.toString())} direction="column">
                <span className="text-xs">Rodada {roundId}</span>
                <MatchVersus match={matchesData[roundId][clubId]} badgeSize={25} />
              </Flex>
            ))
          : null}
      </div>
    </Flex>
  )
}
