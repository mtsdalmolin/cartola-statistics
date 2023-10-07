import { getRoundsData } from '@/app/services/cartola-api'

import { Flex } from '../../flex'
import { MatchVersus } from '../../match-versus'

export async function AssistsRoundMatchesResult({
  clubId,
  assistsRounds
}: {
  clubId: number
  assistsRounds: { [key: string]: number }
}) {
  const matchesData = await getRoundsData(Object.keys(assistsRounds) as unknown as number[])
  return (
    <Flex direction="column">
      {Object.entries(assistsRounds).map(([roundId, scoredGoals]) => (
        <Flex key={roundId} direction="column">
          <Flex className="text-xs" justify="between">
            <span>Rodada {roundId}</span>
            <span>({scoredGoals} assist.)</span>
          </Flex>
          <Flex>
            <MatchVersus match={matchesData[roundId][clubId]} badgeSize={25} />
          </Flex>
        </Flex>
      ))}
    </Flex>
  )
}
