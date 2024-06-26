import { typedOrderBy } from '@/app/helpers/typed-lodash'

import { take, uniqueId } from 'lodash'

import { CrewStatistics } from '../../types/athlete'
import { StatisticsList } from './list'
import { ListHotspot } from './list/hotspot'
import { ListItem } from './list/item'
import { SummaryContainer } from './summary-container'

function renderDefensesToSufferGoalText(defensesToSufferGoal: number, isAbbreviated = true) {
  if (isAbbreviated) return `${defensesToSufferGoal.toFixed(1)} def.`
  return `${defensesToSufferGoal.toFixed(1)} defesa${defensesToSufferGoal > 1 ? 's' : ''}`
}

export function DefenseEfficiency<TCrewData extends CrewStatistics>({
  crewData
}: {
  crewData: TCrewData
}) {
  const orderedDefenseEfficiencyData = typedOrderBy(
    Object.values(crewData),
    'defensesToSufferGoal',
    'desc'
  ).filter((athlete) => athlete.defensesToSufferGoal)

  if (orderedDefenseEfficiencyData.length === 0) return null

  const first = orderedDefenseEfficiencyData[0]
  orderedDefenseEfficiencyData.shift()

  return (
    <SummaryContainer title="Eficiência defensiva">
      <ListHotspot
        imgName={`defense-efficiency_${first.apelido}`}
        name={first.apelido}
        imgSrc={first.foto ?? ''}
        data={renderDefensesToSufferGoalText(first.defensesToSufferGoal, false)}
      />

      <StatisticsList>
        {take(orderedDefenseEfficiencyData, 9).map((athlete, idx) => (
          <ListItem
            key={uniqueId(athlete.atleta_id.toString())}
            name={athlete.apelido}
            imgSrc={athlete.foto ?? ''}
            imgSize={45}
            data={renderDefensesToSufferGoalText(athlete.defensesToSufferGoal)}
            position={idx + 2}
          />
        ))}
      </StatisticsList>
    </SummaryContainer>
  )
}
