import { typedOrderBy } from '@/app/helpers/typed-lodash'

import { take } from 'lodash'

import { CrewStatistics } from '../../types/athlete'
import { StatisticsList } from './list'
import { ListHotspot } from './list/hotspot'
import { ListItem } from './list/item'
import { SummaryContainer } from './summary-container'

function renderHighestPointText(homeAverage: number, isAbbreviated = true) {
  if (isAbbreviated) return `${homeAverage.toFixed(1)} pts.`
  return `${homeAverage.toFixed(1)} ponto${homeAverage > 1 ? 's' : ''}`
}

export function HighestScorer<TCrewData extends CrewStatistics>({
  crewData
}: {
  crewData: TCrewData
}) {
  const orderedHighestScorerData = typedOrderBy(Object.values(crewData), 'highestPoint', 'desc')
  const first = orderedHighestScorerData[0]
  orderedHighestScorerData.shift()
  return (
    <SummaryContainer title="Maior pontuador">
      <ListHotspot
        name={first.apelido}
        imgSrc={first.foto ?? ''}
        data={renderHighestPointText(first.highestPoint, false)}
      />

      <StatisticsList>
        {take(orderedHighestScorerData, 9).map((athlete, idx) => (
          <ListItem
            key={athlete.atleta_id}
            name={athlete.apelido}
            imgSrc={athlete.foto ?? ''}
            imgSize={45}
            data={renderHighestPointText(athlete.highestPoint)}
            position={idx + 2}
          />
        ))}
      </StatisticsList>
    </SummaryContainer>
  )
}
