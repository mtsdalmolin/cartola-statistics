import { typedOrderBy } from '@/app/helpers/typed-lodash'

import { take } from 'lodash'

import { CrewStatistics } from '../../types/athlete'
import { StatisticsList } from './list'
import { ListHotspot } from './list/hotspot'
import { ListItem } from './list/item'
import { SummaryContainer } from './summary-container'

export function MostScheduledPlayer<TCrewData extends CrewStatistics>({
  crewData
}: {
  crewData: TCrewData
}) {
  const mostScheduledPlayerData = typedOrderBy(Object.values(crewData), 'castTimes', 'desc')
  const first = mostScheduledPlayerData[0]
  mostScheduledPlayerData.shift()
  return (
    <SummaryContainer title="Jogador mais escalado">
      <ListHotspot
        name={first.apelido}
        imgSrc={first.foto ?? ''}
        data={first.castTimes.toString()}
      />

      <StatisticsList>
        {take(mostScheduledPlayerData, 9).map((athlete, idx) => (
          <ListItem
            key={athlete.atleta_id}
            name={athlete.apelido}
            imgSrc={athlete.foto ?? ''}
            data={athlete.castTimes.toString()}
            position={idx + 2}
          />
        ))}
      </StatisticsList>
    </SummaryContainer>
  )
}
