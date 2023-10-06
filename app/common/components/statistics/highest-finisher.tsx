import { typedOrderBy } from '@/app/helpers/typed-lodash'

import { take } from 'lodash'

import { CrewStatistics } from '../../types/athlete'
import { StatisticsList } from './list'
import { ListHotspot } from './list/hotspot'
import { ListItem } from './list/item'
import { SummaryContainer } from './summary-container'

function renderNumberOfFinishesText(numberOfFinishes: number, isAbbreviated = true) {
  if (isAbbreviated) return `${numberOfFinishes} finalizaç${numberOfFinishes > 1 ? 'ões' : 'ão'}`
  return `${numberOfFinishes} fin.`
}

export function HighestFinisher<TCrewData extends CrewStatistics>({
  crewData
}: {
  crewData: TCrewData
}) {
  const orderedHighestFinisherData = typedOrderBy(Object.values(crewData), 'finishes', 'desc')
  const first = orderedHighestFinisherData[0]
  orderedHighestFinisherData.shift()
  return (
    <SummaryContainer title="Mais finalizações">
      <ListHotspot
        name={first.apelido}
        imgSrc={first.foto ?? ''}
        data={renderNumberOfFinishesText(first.finishes)}
      />

      <StatisticsList>
        {take(orderedHighestFinisherData, 9).map((athlete, idx) => (
          <ListItem
            key={athlete.atleta_id}
            name={athlete.apelido}
            imgSrc={athlete.foto ?? ''}
            imgSize={45}
            data={renderNumberOfFinishesText(athlete.finishes, false)}
            position={idx + 2}
          />
        ))}
      </StatisticsList>
    </SummaryContainer>
  )
}
