import { useParams } from 'next/navigation'

import { HIGHLIGHT_TO_PARAM } from '@/app/constants/highlight'
import { typedOrderBy } from '@/app/helpers/typed-lodash'

import { take, uniqueId } from 'lodash'

import { CrewStatistics } from '../../types/athlete'
import { ValuationRounds } from './details/valuation-rounds'
import { StatisticsList } from './list'
import { ListHotspot } from './list/hotspot'
import { ListItem } from './list/item'
import { SummaryContainer } from './summary-container'
import { ValuationRoundsText } from './text/valuation-rounds'

const ELEMENT_ID = HIGHLIGHT_TO_PARAM['least-valued-player']

export function LeastValuedPlayer<TCrewData extends CrewStatistics>({
  crewData
}: {
  crewData: TCrewData
}) {
  const { highlight } = useParams()

  const orderedLeastValuedPlayerData = typedOrderBy(
    Object.values(crewData),
    'valuation.rounds.sum' as any,
    'asc'
  )

  if (orderedLeastValuedPlayerData.length === 0) return null

  const first = orderedLeastValuedPlayerData[0]
  orderedLeastValuedPlayerData.shift()

  return (
    <SummaryContainer id={ELEMENT_ID} title="Mais desvalorizados" focus={highlight === ELEMENT_ID}>
      <ListHotspot
        imgName={`least-valued-player_${first.apelido}`}
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
            key={uniqueId(athlete.atleta_id.toString())}
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
