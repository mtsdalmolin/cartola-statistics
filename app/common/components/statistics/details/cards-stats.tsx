import { RoundMatchesData } from '@/app/services/types'

import { Flex } from '../../flex'
import { MatchVersus } from '../../match-versus'

export function CardsStatsDetails({
  cardsRoundIds,
  clubId,
  matchesData
}: {
  cardsRoundIds: { [key: string]: number }
  clubId: number
  matchesData: RoundMatchesData
}) {
  return (
    <Flex className="min-w-[130px] grow-0" direction="column">
      {Object.entries(cardsRoundIds).map(([roundId, numberOfCards]) => (
        <Flex key={roundId} direction="column">
          <Flex className="text-xs truncate" justify="between">
            <span>Rodada {roundId}</span>
            <span>
              ({numberOfCards} cart{numberOfCards > 1 ? 'ões' : 'ão'})
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
