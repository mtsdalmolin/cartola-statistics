import { typedOrderBy } from '@/app/helpers/typed-lodash'

import { take } from 'lodash'

import { CrewStatistics } from '../../types/athlete'
import { StatisticsList } from './list'
import { ListHotspot } from './list/hotspot'
import { ListItem } from './list/item'
import { SummaryContainer } from './summary-container'

function renderDefensesText(defenses: number, isAbbreviated = true) {
  if (isAbbreviated) return `${defenses} def.`
  return `${defenses} defesa${defenses > 1 ? 's' : ''}`
}

export function MoreDefenses<TCrewData extends CrewStatistics>({
  crewData
}: {
  crewData: TCrewData
}) {
  const orderedDefenseEfficiencyData = typedOrderBy(
    Object.values(crewData),
    'defenses',
    'desc'
  ).filter((athlete) => athlete.defenses)
  const first = orderedDefenseEfficiencyData[0]
  orderedDefenseEfficiencyData.shift()
  return (
    <SummaryContainer title="Mais defesas">
      <ListHotspot
        name={first.apelido}
        imgSrc={first.foto ?? ''}
        data={renderDefensesText(first.defenses, false)}
      />

      <StatisticsList>
        {take(orderedDefenseEfficiencyData, 9).map((athlete, idx) => (
          <ListItem
            key={athlete.atleta_id}
            name={athlete.apelido}
            imgSrc={athlete.foto ?? ''}
            imgSize={45}
            data={renderDefensesText(athlete.defenses)}
            position={idx + 2}
          />
        ))}
      </StatisticsList>
    </SummaryContainer>
  )
}
