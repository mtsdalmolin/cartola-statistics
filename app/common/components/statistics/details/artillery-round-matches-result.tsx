import { getRoundsData } from '@/app/services/cartola-api'

import { Flex } from '../../flex'
import { MatchVersus } from '../../match-versus'

export async function ArtilleryRoundMatchesResult({
  clubId,
  scoredGoalsRounds,
  isAnimated = false
}: {
  clubId: number
  scoredGoalsRounds: { [key: string]: number }
  isAnimated?: boolean
}) {
  const matchesData = await getRoundsData(Object.keys(scoredGoalsRounds) as unknown as number[])
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
