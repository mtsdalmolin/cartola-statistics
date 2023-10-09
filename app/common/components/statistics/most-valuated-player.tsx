import { typedOrderBy } from '@/app/helpers/typed-lodash'

import { take } from 'lodash'

import { CrewStatistics } from '../../types/athlete'
import { Flex } from '../flex'
import { StatisticsList } from './list'
import { ListHotspot } from './list/hotspot'
import { ListItem } from './list/item'
import { SummaryContainer } from './summary-container'

function renderAboveZeroValuationRoundsText(
  valuatedRoundsAboveZero: number,
  valuationValue: number,
  isAbbreviated = true
) {
  if (isAbbreviated)
    return (
      <span>
        {`${valuatedRoundsAboveZero} rds.`}(
        <span className={valuationValue > 0 ? 'text-palette-primary-700' : 'text-red-500'}>
          {valuationValue > 0 ? `+${valuationValue.toFixed(1)}` : valuationValue}
        </span>
        )
      </span>
    )
  return (
    <span>
      {`${valuatedRoundsAboveZero} rodada${valuatedRoundsAboveZero > 1 ? 's' : ''}`} (
      <span className={valuationValue > 0 ? 'text-palette-primary-700' : 'text-red-500'}>
        {valuationValue > 0 ? `+${valuationValue.toFixed(1)}` : valuationValue}
      </span>
      )
    </span>
  )
}

export function MostValuatedPlayer<TCrewData extends CrewStatistics>({
  crewData
}: {
  crewData: TCrewData
}) {
  const orderedMostValuatedPlayerData = typedOrderBy(
    Object.values(crewData),
    'valuation.rounds.sum' as any,
    'desc'
  )
  const first = orderedMostValuatedPlayerData[0]
  orderedMostValuatedPlayerData.shift()
  return (
    <SummaryContainer title="Mais valorizados">
      <ListHotspot
        name={first.apelido}
        imgSrc={first.foto ?? ''}
        data={renderAboveZeroValuationRoundsText(
          first.valuation.rounds.aboveZero,
          first.valuation.rounds.sum,
          false
        )}
        details={
          <Flex className="min-w-[130px] grow-0" direction="column">
            {first.valuation.rounds.values
              .filter(([_, valuation]) => valuation > 0)
              .map(([roundId, valuation]) => (
                <Flex key={roundId} className="w-full text-xs pr-4" justify="between">
                  <div>Rodada {roundId}:</div>
                  <div className="text-palette-primary-700">
                    {valuation > 0 ? `+${valuation}` : valuation}
                  </div>
                </Flex>
              ))}
          </Flex>
        }
      />

      <StatisticsList>
        {take(orderedMostValuatedPlayerData, 9).map((athlete, idx) => (
          <ListItem
            key={athlete.atleta_id}
            name={athlete.apelido}
            imgSrc={athlete.foto ?? ''}
            imgSize={45}
            data={renderAboveZeroValuationRoundsText(
              athlete.valuation.rounds.aboveZero,
              athlete.valuation.rounds.sum
            )}
            position={idx + 2}
          />
        ))}
      </StatisticsList>
    </SummaryContainer>
  )
}
