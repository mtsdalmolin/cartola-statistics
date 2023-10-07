import { getRoundsData } from '@/app/services/cartola-api'

import { Flex } from '../../flex'
import { MatchVersus } from '../../match-versus'

export async function GoalsScoredMatches({
  clubId,
  roundIds
}: {
  clubId: number
  roundIds: number[]
}) {
  const matchesData = await getRoundsData(roundIds)
  return (
    <Flex direction="column">
      {roundIds.map((roundId) => (
        <Flex key={roundId} direction="column">
          <span className="text-xs">Rodada {roundId}</span>
          <MatchVersus match={matchesData[roundId][clubId]} badgeSize={25} />
        </Flex>
      ))}
    </Flex>
  )
}
