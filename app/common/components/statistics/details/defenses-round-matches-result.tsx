import { getRoundsData } from '@/app/services/cartola-api'

import { Flex } from '../../flex'
import { MatchVersus } from '../../match-versus'

export async function DefensesRoundMatchesResult({
  clubId,
  defensesRounds,
  isAnimated = false
}: {
  clubId: number
  defensesRounds: { [key: string]: number }
  isAnimated?: boolean
}) {
  const matchesData = await getRoundsData(Object.keys(defensesRounds) as unknown as number[])
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
