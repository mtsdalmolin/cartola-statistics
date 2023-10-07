import { getRoundsData } from '@/app/services/cartola-api'

import { Flex } from '../../flex'
import { MatchVersus } from '../../match-versus'

export async function ArtilleryRoundMatchesResult({
  clubId,
  scoredGoalsRounds
}: {
  clubId: number
  scoredGoalsRounds: { [key: string]: number }
}) {
  const matchesData = await getRoundsData(Object.keys(scoredGoalsRounds) as unknown as number[])
  return (
    <Flex direction="column">
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
    </Flex>
  )
}
