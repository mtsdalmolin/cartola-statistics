import { RoundMatchesData } from '@/app/services/types'

import { Flex } from '../../flex'
import { MatchVersus } from '../../match-versus'

export function AssistsRoundMatchesResult({
  clubId,
  assistsRounds,
  matchesData
}: {
  clubId: number
  assistsRounds: { [key: string]: number }
  matchesData: RoundMatchesData
}) {
  return (
    <Flex className="w-min" direction="column">
      {Object.entries(assistsRounds).map(([roundId, scoredGoals]) => (
        <Flex key={roundId} direction="column">
          <Flex className="text-xs truncate" justify="between">
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
