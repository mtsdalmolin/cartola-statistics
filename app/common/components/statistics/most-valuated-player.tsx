import { typedOrderBy } from '@/app/helpers/typed-lodash'

import { take } from 'lodash'

import { CrewStatistics } from '../../types/athlete'
import { ValuationRounds } from './details/valuation-rounds'
import { StatisticsList } from './list'
import { ListHotspot } from './list/hotspot'
import { ListItem } from './list/item'
import { SummaryContainer } from './summary-container'
import { ValuationRoundsText } from './text/valuation-rounds'

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
        data={
          <ValuationRoundsText
            valuatedRoundsAboveZero={first.valuation.rounds.aboveZero}
            valuationValue={first.valuation.rounds.sum}
          />
        }
        details={
          <ValuationRounds
            valuationRoundValues={first.valuation.rounds.values.filter(
              ([_, valuation]) => valuation > 0
            )}
          />
        }
      />

      <StatisticsList>
        {take(orderedMostValuatedPlayerData, 9).map((athlete, idx) => (
          <ListItem
            key={athlete.atleta_id}
            name={athlete.apelido}
            imgSrc={athlete.foto ?? ''}
            imgSize={45}
            data={
              <ValuationRoundsText
                valuatedRoundsAboveZero={athlete.valuation.rounds.aboveZero}
                valuationValue={athlete.valuation.rounds.sum}
                isAbbreviated
              />
            }
            position={idx + 2}
          />
        ))}
      </StatisticsList>
    </SummaryContainer>
  )
}
