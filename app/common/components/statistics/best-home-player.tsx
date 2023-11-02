import { useParams } from 'next/navigation'

import { HIGHLIGHT_TO_PARAM } from '@/app/constants/highlight'
import { typedOrderBy } from '@/app/helpers/typed-lodash'

import { take } from 'lodash'

import { CrewStatistics } from '../../types/athlete'
import { StatisticsList } from './list'
import { ListHotspot } from './list/hotspot'
import { ListItem } from './list/item'
import { SummaryContainer } from './summary-container'

const ELEMENT_ID = HIGHLIGHT_TO_PARAM['best-home-player']

function renderHomeAverageText(homeAverage: number, isAbbreviated = true) {
  if (isAbbreviated) return `${homeAverage.toFixed(1)} pts.`
  return `${homeAverage.toFixed(1)} ponto${homeAverage > 1 ? 's' : ''}`
}

export function BestHomePlayer<TCrewData extends CrewStatistics>({
  crewData
}: {
  crewData: TCrewData
}) {
  const { highlight } = useParams()

  const orderedBestHomePlayerData = typedOrderBy(
    Object.values(crewData),
    'home.average' as any,
    'desc'
  )
  const first = orderedBestHomePlayerData[0]
  orderedBestHomePlayerData.shift()
  return (
    <SummaryContainer
      id={ELEMENT_ID}
      title="Média jogando em casa"
      focus={highlight === ELEMENT_ID}
    >
      <ListHotspot
        imgName={`best-home-player_${first.apelido}`}
        name={first.apelido}
        imgSrc={first.foto ?? ''}
        data={renderHomeAverageText(first.home.average, false)}
      />

      <StatisticsList>
        {take(orderedBestHomePlayerData, 9).map((athlete, idx) => (
          <ListItem
            key={athlete.atleta_id}
            name={athlete.apelido}
            imgSrc={athlete.foto ?? ''}
            imgSize={45}
            data={renderHomeAverageText(athlete.home.average)}
            position={idx + 2}
          />
        ))}
      </StatisticsList>
    </SummaryContainer>
  )
}
