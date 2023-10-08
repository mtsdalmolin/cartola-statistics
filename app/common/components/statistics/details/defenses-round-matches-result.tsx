import { getRoundsData } from '@/app/services/cartola-api'

import { Flex } from '../../flex'
import { MatchVersus } from '../../match-versus'

export async function DefensesRoundMatchesResult({
  clubId,
  defensesRounds
}: {
  clubId: number
  defensesRounds: { [key: string]: number }
}) {
  const matchesData = await getRoundsData(Object.keys(defensesRounds) as unknown as number[])
  return (
    <Flex className="w-min" direction="column">
      {Object.entries(defensesRounds).map(([roundId, defenses]) => (
        <Flex key={roundId} direction="column">
          <Flex className="text-xs" justify="between">
            <span>Rodada {roundId}</span>
            <span>({defenses} def.)</span>
          </Flex>
          <Flex>
            <MatchVersus match={matchesData[roundId][clubId]} badgeSize={25} />
          </Flex>
        </Flex>
      ))}
    </Flex>
  )
}
