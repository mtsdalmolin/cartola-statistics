import { RoundMatchesData } from '@/app/services/types'

import { Flex } from '../../flex'
import { MatchVersus } from '../../match-versus'

export function ArtilleryRoundMatchesResult({
  clubId,
  matchesData,
  scoredGoalsRounds,
  isAnimated = false
}: {
  clubId: number
  matchesData: RoundMatchesData
  scoredGoalsRounds: { [key: string]: number }
  isAnimated?: boolean
}) {
  return (
    <Flex
      className={`min-w-[130px] w-min max-h-60 ${isAnimated ? 'flex-nowrap overflow-hidden' : ''}`}
      direction="column"
    >
      <div className={isAnimated ? 'h-max animate-scrollVertically hover:pause-animation' : ''}>
        {Object.entries(scoredGoalsRounds).map(([roundId, scoredGoals]) => (
          <Flex key={roundId} direction="column">
            <Flex className="text-xs" justify="between">
              <span>Rodada {roundId}</span>
              <span>
                ({scoredGoals} gol{scoredGoals > 1 ? 's' : ''})
              </span>
            </Flex>
            <Flex>
              <MatchVersus match={matchesData[roundId][clubId]} badgeSize={25} />
            </Flex>
          </Flex>
        ))}
        {isAnimated
          ? Object.entries(scoredGoalsRounds).map(([roundId, scoredGoals]) => (
              <Flex aria-hidden="true" key={roundId} direction="column">
                <Flex className="text-xs" justify="between">
                  <span>Rodada {roundId}</span>
                  <span>
                    ({scoredGoals} gol{scoredGoals > 1 ? 's' : ''})
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
