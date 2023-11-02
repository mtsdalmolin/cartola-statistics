import { useParams } from 'next/navigation'

import { HIGHLIGHT_TO_PARAM } from '@/app/constants/highlight'
import { typedOrderBy } from '@/app/helpers/typed-lodash'

import { take } from 'lodash'

import { CrewStatistics } from '../../types/athlete'
import { StatisticsList } from './list'
import { ListHotspot } from './list/hotspot'
import { ListItem } from './list/item'
import { SummaryContainer } from './summary-container'

const ELEMENT_ID = HIGHLIGHT_TO_PARAM['best-away-player']

function renderAwayAverageText(homeAverage: number, isAbbreviated = true) {
  if (isAbbreviated) return `${homeAverage.toFixed(1)} pts.`
  return `${homeAverage.toFixed(1)} ponto${homeAverage > 1 ? 's' : ''}`
}

export function BestAwayPlayer<TCrewData extends CrewStatistics>({
  crewData
}: {
  crewData: TCrewData
}) {
  const { highlight } = useParams()

  const orderedBestAwayPlayerData = typedOrderBy(
    Object.values(crewData),
    'away.average' as any,
    'desc'
  )
  const first = orderedBestAwayPlayerData[0]
  orderedBestAwayPlayerData.shift()

  return (
    <SummaryContainer id={ELEMENT_ID} title="Média jogando fora" focus={highlight === ELEMENT_ID}>
      <ListHotspot
        imgName={`best-away-player_${first.apelido}`}
        name={first.apelido}
        imgSrc={first.foto ?? ''}
        data={renderAwayAverageText(first.away.average, false)}
      />

      <StatisticsList>
        {take(orderedBestAwayPlayerData, 9).map((athlete, idx) => (
          <ListItem
            key={athlete.atleta_id}
            name={athlete.apelido}
            imgSrc={athlete.foto ?? ''}
            imgSize={45}
            data={renderAwayAverageText(athlete.away.average)}
            position={idx + 2}
          />
        ))}
      </StatisticsList>
    </SummaryContainer>
  )
}
