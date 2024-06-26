import { useParams } from 'next/navigation'

import { HIGHLIGHT_TO_PARAM } from '@/app/constants/highlight'
import { getAthleteFinishes } from '@/app/helpers/formatters/cartola'
import { typedOrderBy } from '@/app/helpers/typed-lodash'

import { take, uniqueId } from 'lodash'

import { CrewStatistics } from '../../types/athlete'
import { FinishStats } from './details/finish-stats'
import { StatisticsList } from './list'
import { ListHotspot } from './list/hotspot'
import { ListItem } from './list/item'
import { SummaryContainer } from './summary-container'

const ELEMENT_ID = HIGHLIGHT_TO_PARAM['highest-finisher']

function renderNumberOfFinishesText(numberOfFinishes: number, isAbbreviated = true) {
  if (isAbbreviated) return `${numberOfFinishes} fin.`
  return `${numberOfFinishes} finalizaç${numberOfFinishes > 1 ? 'ões' : 'ão'}`
}

export function HighestFinisher<TCrewData extends CrewStatistics>({
  crewData
}: {
  crewData: TCrewData
}) {
  const { highlight } = useParams()

  const orderedHighestFinisherData = typedOrderBy(Object.values(crewData), 'finishes', 'desc')

  if (orderedHighestFinisherData.length === 0) return null

  const first = orderedHighestFinisherData[0]
  orderedHighestFinisherData.shift()

  return (
    <SummaryContainer id={ELEMENT_ID} title="Mais finalizações" focus={highlight === ELEMENT_ID}>
      <ListHotspot
        imgName={`highest-finisher_${first.apelido}`}
        name={first.apelido}
        imgSrc={first.foto ?? ''}
        data={renderNumberOfFinishesText(first.finishes, false)}
        details={<FinishStats finishes={getAthleteFinishes(first)} />}
      />

      <StatisticsList>
        {take(orderedHighestFinisherData, 9).map((athlete, idx) => (
          <ListItem
            key={uniqueId(athlete.atleta_id.toString())}
            name={athlete.apelido}
            imgSrc={athlete.foto ?? ''}
            imgSize={45}
            data={renderNumberOfFinishesText(athlete.finishes)}
            position={idx + 2}
          />
        ))}
      </StatisticsList>
    </SummaryContainer>
  )
}
