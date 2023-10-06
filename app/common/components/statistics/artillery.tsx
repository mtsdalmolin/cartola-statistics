import { typedOrderBy } from '@/app/helpers/typed-lodash'

import { take } from 'lodash'

import { CrewStatistics } from '../../types/athlete'
import { StatisticsList } from './list'
import { ListHotspot } from './list/hotspot'
import { ListItem } from './list/item'
import { SummaryContainer } from './summary-container'

function renderGoalsText(numberOfGoals: number) {
  return `${numberOfGoals} gol${numberOfGoals > 1 ? 's' : ''}`
}

export function Artillery<TCrewData extends CrewStatistics>({ crewData }: { crewData: TCrewData }) {
  const orderedArtilleryData = typedOrderBy(Object.values(crewData), 'goals', 'desc').filter(
    (athlete) => athlete.goals > 0
  )
  const first = orderedArtilleryData[0]
  orderedArtilleryData.shift()
  return (
    <SummaryContainer title="Artilharia">
      <ListHotspot
        name={first.apelido}
        imgSrc={first.foto ?? ''}
        data={renderGoalsText(first.goals)}
      />

      <StatisticsList>
        {take(orderedArtilleryData, 9).map((athlete, idx) => (
          <ListItem
            key={athlete.atleta_id}
            name={athlete.apelido}
            imgSrc={athlete.foto ?? ''}
            imgSize={45}
            data={renderGoalsText(athlete.goals)}
            position={idx + 2}
          />
        ))}
      </StatisticsList>
    </SummaryContainer>
  )
}
