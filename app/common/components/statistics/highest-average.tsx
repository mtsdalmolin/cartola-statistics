import { useParams } from 'next/navigation'

import { HIGHLIGHT_TO_PARAM } from '@/app/constants/highlight'
import { typedOrderBy } from '@/app/helpers/typed-lodash'
import { RoundMatchesData } from '@/app/services/types'

import { take, uniqueId } from 'lodash'

import { CrewStatistics } from '../../types/athlete'
import { AnimatedStatsRoundMatchesResult } from './details/animated-stats-round-matches-result'
import { StatisticsList } from './list'
import { ListHotspot } from './list/hotspot'
import { ListItem } from './list/item'
import { SummaryContainer } from './summary-container'

const ELEMENT_ID = HIGHLIGHT_TO_PARAM['highest-average']

function renderPointsAverageText(pointsAverage: string, isAbbreviated = true) {
  if (isAbbreviated) return `${pointsAverage} P/R`
  return `${pointsAverage} pts./rodada`
}

export function HighestAverage<TCrewData extends CrewStatistics>({
  crewData,
  matchesData
}: {
  crewData: TCrewData
  matchesData: RoundMatchesData
}) {
  const { highlight } = useParams()

  const orderedHighestAverageData = typedOrderBy(Object.values(crewData), 'pointsAverage', 'desc')

  if (orderedHighestAverageData.length === 0) return null

  const first = orderedHighestAverageData[0]
  orderedHighestAverageData.shift()

  return (
    <SummaryContainer id={ELEMENT_ID} title="Maior média" focus={highlight === ELEMENT_ID}>
      <ListHotspot
        imgName={`highest-average_${first.apelido}`}
        name={first.apelido}
        imgSrc={first.foto ?? ''}
        data={renderPointsAverageText(first.pointsAverage.toFixed(1), false)}
        details={
          <AnimatedStatsRoundMatchesResult
            clubId={first.clube_id}
            matchesData={matchesData}
            statRounds={first.pointsPerRound}
            statText="pts."
            isAnimated={Object.keys(first.pointsPerRound).length > 5}
          />
        }
      />

      <StatisticsList>
        {take(orderedHighestAverageData, 9).map((athlete, idx) => (
          <ListItem
            key={uniqueId(athlete.atleta_id.toString())}
            name={athlete.apelido}
            imgSrc={athlete.foto ?? ''}
            imgSize={45}
            data={renderPointsAverageText(athlete.pointsAverage.toFixed(1))}
            position={idx + 2}
          />
        ))}
      </StatisticsList>
    </SummaryContainer>
  )
}
