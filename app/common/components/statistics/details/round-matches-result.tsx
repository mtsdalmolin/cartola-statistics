import { getRoundsData } from '@/app/services/cartola-api'

import { Flex } from '../../flex'
import { MatchVersus } from '../../match-versus'

export async function RoundMatchesResult({
  clubId,
  roundIds,
  isAnimated = false
}: {
  clubId: number
  roundIds: number[]
  isAnimated?: boolean
}) {
  const matchesData = await getRoundsData(roundIds)
  return (
    <Flex
      className={`min-w-[130px] w-min max-h-60 ${isAnimated ? 'flex-nowrap overflow-hidden' : ''}`}
      direction="column"
    >
      <div className={isAnimated ? 'h-max animate-scrollVertically hover:pause-animation' : ''}>
        {roundIds.map((roundId) => (
          <Flex key={roundId} direction="column">
            <span className="text-xs">Rodada {roundId}</span>
            <MatchVersus match={matchesData[roundId][clubId]} badgeSize={25} />
          </Flex>
        ))}
        {isAnimated
          ? roundIds.map((roundId) => (
              <Flex aria-hidden="true" key={roundId} direction="column">
                <span className="text-xs">Rodada {roundId}</span>
                <MatchVersus match={matchesData[roundId][clubId]} badgeSize={25} />
              </Flex>
            ))
          : null}
      </div>
    </Flex>
  )
}
