import { RoundMatchesData } from '@/app/services/types'

import { Flex } from '../../flex'
import { MatchVersus } from '../../match-versus'

export function AnimatedStatsRoundMatchesResult({
  clubId,
  matchesData,
  statRounds,
  statText,
  isAnimated = false
}: {
  clubId: number
  matchesData: RoundMatchesData
  statRounds: { [key: string]: number }
  statText: string | ((statValue: number) => string)
  isAnimated?: boolean
}) {
  return (
    <Flex
      className={`min-w-[130px] w-min max-h-60 ${isAnimated ? 'flex-nowrap overflow-hidden' : ''}`}
      direction="column"
    >
      <div className={isAnimated ? 'h-max animate-scrollVertically hover:pause-animation' : ''}>
        {Object.entries(statRounds).map(([roundId, statValue]) => (
          <Flex key={roundId} direction="column">
            <Flex className="text-xs" justify="between">
              <span>Rodada {roundId}</span>
              <span>
                ({statValue} {typeof statText === 'function' ? statText(statValue) : statText})
              </span>
            </Flex>
            <Flex>
              <MatchVersus match={matchesData[roundId][clubId]} badgeSize={25} />
            </Flex>
          </Flex>
        ))}
        {isAnimated
          ? Object.entries(statRounds).map(([roundId, statValue]) => (
              <Flex aria-hidden="true" key={roundId} direction="column">
                <Flex className="text-xs" justify="between">
                  <span>Rodada {roundId}</span>
                  <span>
                    ({statValue} {typeof statText === 'function' ? statText(statValue) : statText})
                  </span>
                </Flex>
                <Flex>
                  <MatchVersus match={matchesData[roundId][clubId]} badgeSize={25} />
                </Flex>
              </Flex>
            ))
          : null}
      </div>
    </Flex>
  )
}
