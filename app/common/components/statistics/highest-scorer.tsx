import { useParams } from 'next/navigation'

import { HIGHLIGHT_TO_PARAM } from '@/app/constants/highlight'
import { typedOrderBy } from '@/app/helpers/typed-lodash'
import { RoundMatchesData } from '@/app/services/types'

import { take, uniqueId } from 'lodash'

import { CrewStatistics } from '../../types/athlete'
import { DetailedScore } from './details/detailed-score'
import { RoundMatchesResult } from './details/round-matches-result'
import { StatisticsList } from './list'
import { ListHotspot } from './list/hotspot'
import { ListItem } from './list/item'
import { SummaryContainer } from './summary-container'

const ELEMENT_ID = HIGHLIGHT_TO_PARAM['highest-scorer']

function renderHighestPointText(homeAverage: number, isAbbreviated = true) {
  if (isAbbreviated) return `${homeAverage.toFixed(1)} pts.`
  return `${homeAverage.toFixed(1)} ponto${homeAverage > 1 ? 's' : ''}`
}

export function HighestScorer<TCrewData extends CrewStatistics>({
  crewData,
  matchesData
}: {
  crewData: TCrewData
  matchesData: RoundMatchesData
}) {
  const { highlight } = useParams()

  const orderedHighestScorerData = typedOrderBy(Object.values(crewData), 'highestPoint', 'desc')

  if (orderedHighestScorerData.length === 0) return null

  const first = orderedHighestScorerData[0]
  orderedHighestScorerData.shift()

  if (!first) return null

  return (
    <SummaryContainer id={ELEMENT_ID} title="Maior pontuador" focus={highlight === ELEMENT_ID}>
      <ListHotspot
        imgName={`highest-scorer_${first.apelido}`}
        name={first.apelido}
        imgSrc={first.foto ?? ''}
        data={renderHighestPointText(first.highestPoint, false)}
        details={
          <RoundMatchesResult
            clubId={first.clube_id}
            roundIds={[first.highestPointsRound]}
            matchesData={matchesData}
          />
        }
      />

      <DetailedScore highestPoints={first.highestPoint} scout={first.highestPointScout} />

      <StatisticsList>
        {take(orderedHighestScorerData, 9).map((athlete, idx) => (
          <ListItem
            key={uniqueId(athlete.atleta_id.toString())}
            name={athlete.apelido}
            imgSrc={athlete.foto ?? ''}
            imgSize={45}
            data={renderHighestPointText(athlete.highestPoint)}
            position={idx + 2}
          />
        ))}
      </StatisticsList>
    </SummaryContainer>
  )
}
