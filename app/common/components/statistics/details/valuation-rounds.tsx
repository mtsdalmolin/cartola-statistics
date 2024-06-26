import { uniqueId } from 'lodash'

import { Flex } from '../../flex'

export function ValuationRounds({
  valuationRoundValues
}: {
  valuationRoundValues: [number, number][]
}) {
  return (
    <Flex className="min-w-[130px] grow-0" direction="column">
      {valuationRoundValues.map(([roundId, valuation]) => (
        <Flex key={uniqueId(roundId.toString())} className="w-full text-xs pr-4" justify="between">
          <div>Rodada {roundId}:</div>
          <div className={valuation > 0 ? 'text-palette-primary-700' : 'text-red-500'}>
            {valuation > 0 ? `+${valuation}` : valuation}
          </div>
        </Flex>
      ))}
    </Flex>
  )
}
