import { isCoach } from '@/app/helpers/positions'
import { typedOrderBy } from '@/app/helpers/typed-lodash'
import { Tooltip } from '@mantine/core'

import { take } from 'lodash'

import { CrewStatistics } from '../../types/athlete'
import { RoundMatchesResult } from './details/round-matches-result'
import { StatisticsList } from './list'
import { ListHotspot } from './list/hotspot'
import { ListItem } from './list/item'
import { SummaryContainer } from './summary-container'

function renderVictoriesAverageTooltipLabel(castTimes: number, victories: number) {
  return `${castTimes} escalaç${castTimes > 1 ? 'ões' : 'ão'} e ${victories} vitória${
    victories > 1 ? 's' : ''
  }`
}

function renderVictoriesAverageText(victoriesAverage: number, isAbbreviated = true) {
  return `${(victoriesAverage * 100).toFixed(0)}% ${isAbbreviated ? '' : 'de aprov.'}`
}

export function BestCoach<TCrewData extends CrewStatistics>({ crewData }: { crewData: TCrewData }) {
  const orderedDefenseEfficiencyData = typedOrderBy(
    Object.values(crewData).filter(
      (athlete) => isCoach(athlete.posicao_id) && athlete.victoriesAverage
    ),
    ['scout.V' as any, 'victoriesAverage', 'castTimes'],
    ['desc', 'desc', 'desc']
  )
  const first = orderedDefenseEfficiencyData[0]
  orderedDefenseEfficiencyData.shift()
  return (
    <SummaryContainer title="Melhor técnico">
      <ListHotspot
        name={first.apelido}
        imgSrc={first.foto ?? ''}
        data={
          <Tooltip label={renderVictoriesAverageTooltipLabel(first.castTimes, first.scout.V ?? 0)}>
            <span>{renderVictoriesAverageText(first.victoriesAverage, false)}</span>
          </Tooltip>
        }
        details={<RoundMatchesResult clubId={first.clube_id} roundIds={first.victoriesRoundIds} />}
      />

      <StatisticsList>
        {take(orderedDefenseEfficiencyData, 9).map((athlete, idx) => (
          <ListItem
            key={athlete.atleta_id}
            name={athlete.apelido}
            imgSrc={athlete.foto ?? ''}
            imgSize={45}
            data={
              <Tooltip
                label={renderVictoriesAverageTooltipLabel(athlete.castTimes, athlete.scout.V ?? 0)}
              >
                <span>{renderVictoriesAverageText(athlete.victoriesAverage)}</span>
              </Tooltip>
            }
            position={idx + 2}
          />
        ))}
      </StatisticsList>
    </SummaryContainer>
  )
}
