import { useParams } from 'next/navigation'

import { HIGHLIGHT_TO_PARAM } from '@/app/constants/highlight'
import { typedOrderBy } from '@/app/helpers/typed-lodash'
import { RoundMatchesData } from '@/app/services/types'

import { take, uniqueId } from 'lodash'

import { CrewStatistics } from '../../types/athlete'
import { RoundMatchesResult } from './details/round-matches-result'
import { StatisticsList } from './list'
import { ListHotspot } from './list/hotspot'
import { ListItem } from './list/item'
import { SummaryContainer } from './summary-container'

const ELEMENT_ID = HIGHLIGHT_TO_PARAM['most-points']

function renderMostPointsText(sumOfPoints: number, isAbbreviated = true) {
  if (isAbbreviated) return `${sumOfPoints.toFixed(1)} pts.`
  return `${sumOfPoints.toFixed(1)} ponto${sumOfPoints > 1 ? 's' : ''}`
}

export function MostPoints<TCrewData extends CrewStatistics>({
  crewData,
  matchesData
}: {
  crewData: TCrewData
  matchesData: RoundMatchesData
}) {
  const { highlight } = useParams()

  const orderedMostPointsPlayerData = typedOrderBy(Object.values(crewData), 'sumOfPoints', 'desc')

  if (orderedMostPointsPlayerData.length === 0) return null

  const first = orderedMostPointsPlayerData[0]
  orderedMostPointsPlayerData.shift()
  return (
    <SummaryContainer
      id={ELEMENT_ID}
      title="Somatória das pontuações"
      focus={highlight === ELEMENT_ID}
    >
      <ListHotspot
        imgName={`most-points_${first.apelido}`}
        name={first.apelido}
        imgSrc={first.foto ?? ''}
        data={renderMostPointsText(first.sumOfPoints, false)}
        details={
          <RoundMatchesResult
            clubId={first.clube_id}
            roundIds={first.castRounds}
            matchesData={matchesData}
          />
        }
      />

      <StatisticsList>
        {take(orderedMostPointsPlayerData, 9).map((athlete, idx) => (
          <ListItem
            key={uniqueId(athlete.atleta_id.toString())}
            name={athlete.apelido}
            imgSrc={athlete.foto ?? ''}
            imgSize={45}
            data={renderMostPointsText(athlete.sumOfPoints, false)}
            position={idx + 2}
          />
        ))}
      </StatisticsList>
    </SummaryContainer>
  )
}
