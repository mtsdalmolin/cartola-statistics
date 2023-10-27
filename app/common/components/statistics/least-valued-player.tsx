import { typedOrderBy } from '@/app/helpers/typed-lodash'

import { take } from 'lodash'

import { CrewStatistics } from '../../types/athlete'
import { ValuationRounds } from './details/valuation-rounds'
import { StatisticsList } from './list'
import { ListHotspot } from './list/hotspot'
import { ListItem } from './list/item'
import { SummaryContainer } from './summary-container'
import { ValuationRoundsText } from './text/valuation-rounds'

export function LeastValuedPlayer<TCrewData extends CrewStatistics>({
  crewData
}: {
  crewData: TCrewData
}) {
  const orderedLeastValuedPlayerData = typedOrderBy(
    Object.values(crewData),
    'valuation.rounds.sum' as any,
    'asc'
  )
  const first = orderedLeastValuedPlayerData[0]
  orderedLeastValuedPlayerData.shift()
  return (
    <SummaryContainer title="Mais desvalorizados">
      <ListHotspot
        name={first.apelido}
        imgSrc={first.foto ?? ''}
        data={
          <ValuationRoundsText
            valuedRoundsAboveZero={first.valuation.rounds.belowZero}
            valuationValue={first.valuation.rounds.sum}
          />
        }
        details={
          <ValuationRounds
            valuationRoundValues={first.valuation.rounds.values.filter(
              ([_, valuation]) => valuation < 0
            )}
          />
        }
      />

      <StatisticsList>
        {take(orderedLeastValuedPlayerData, 9).map((athlete, idx) => (
          <ListItem
            key={athlete.atleta_id}
            name={athlete.apelido}
            imgSrc={athlete.foto ?? ''}
            imgSize={45}
            data={
              <ValuationRoundsText
                valuedRoundsAboveZero={athlete.valuation.rounds.belowZero}
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
