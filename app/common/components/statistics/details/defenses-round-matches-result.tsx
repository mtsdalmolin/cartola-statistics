import { RoundMatchesData } from '@/app/services/types'

import { Flex } from '../../flex'
import { MatchVersus } from '../../match-versus'

export function DefensesRoundMatchesResult({
  clubId,
  defensesRounds,
  matchesData,
  isAnimated = false
}: {
  clubId: number
  defensesRounds: { [key: string]: number }
  matchesData: RoundMatchesData
  isAnimated?: boolean
}) {
  return (
    <Flex
      className={`min-w-[130px] w-min max-h-60 ${isAnimated ? 'flex-nowrap overflow-hidden' : ''}`}
      direction="column"
    >
      <div className={isAnimated ? 'h-max animate-scrollVertically hover:pause-animation' : ''}>
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
        {isAnimated
          ? Object.entries(defensesRounds).map(([roundId, defenses]) => (
              <Flex aria-hidden="true" key={roundId} direction="column">
                <Flex className="text-xs" justify="between">
                  <span>Rodada {roundId}</span>
                  <span>({defenses} def.)</span>
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
