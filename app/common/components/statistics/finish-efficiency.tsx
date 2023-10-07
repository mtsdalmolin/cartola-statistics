import { typedOrderBy } from '@/app/helpers/typed-lodash'

import { take } from 'lodash'

import { CrewStatistics } from '../../types/athlete'
import { StatisticsList } from './list'
import { ListHotspot } from './list/hotspot'
import { ListItem } from './list/item'
import { SummaryContainer } from './summary-container'

function renderFinishesToScoreText(finishesToScore: number, isAbbreviated = true) {
  if (isAbbreviated) return `${finishesToScore.toFixed(1)} fin.`
  return `${finishesToScore.toFixed(1)} finalizaç${finishesToScore > 1 ? 'ões' : 'ão'}`
}

export function FinishEfficiency<TCrewData extends CrewStatistics>({
  crewData
}: {
  crewData: TCrewData
}) {
  const orderedFinishEfficiencyData = typedOrderBy(
    Object.values(crewData).filter((athlete) => isFinite(athlete.finishesToScore)),
    'finishesToScore'
  )
  const first = orderedFinishEfficiencyData[0]
  orderedFinishEfficiencyData.shift()
  return (
    <SummaryContainer title="Eficiência de conversão">
      <ListHotspot
        name={first.apelido}
        imgSrc={first.foto ?? ''}
        data={renderFinishesToScoreText(first.finishesToScore, false)}
      />

      <StatisticsList>
        {take(orderedFinishEfficiencyData, 9).map((athlete, idx) => (
          <ListItem
            key={athlete.atleta_id}
            name={athlete.apelido}
            imgSrc={athlete.foto ?? ''}
            imgSize={45}
            data={renderFinishesToScoreText(athlete.finishesToScore)}
            position={idx + 2}
          />
        ))}
      </StatisticsList>
    </SummaryContainer>
  )
}
