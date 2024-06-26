import { useParams } from 'next/navigation'

import { HIGHLIGHT_TO_PARAM } from '@/app/constants/highlight'
import { typedOrderBy } from '@/app/helpers/typed-lodash'
import { RoundMatchesData } from '@/app/services/types'

import { isEmpty, take, uniqueId } from 'lodash'

import { CrewStatistics } from '../../types/athlete'
import { AnimatedStatsRoundMatchesResult } from './details/animated-stats-round-matches-result'
import { StatisticsList } from './list'
import { ListHotspot } from './list/hotspot'
import { ListItem } from './list/item'
import { SummaryContainer } from './summary-container'

const ELEMENT_ID = HIGHLIGHT_TO_PARAM['best-bench']

function renderPointsAverageText(homeAverage: number, isAbbreviated = true) {
  if (isAbbreviated) return `${homeAverage.toFixed(1)} pts.`
  return `${homeAverage.toFixed(1)} ponto${homeAverage > 1 ? 's' : ''}`
}

export function BestBench<TCrewData extends CrewStatistics>({
  crewData,
  matchesData
}: {
  crewData: TCrewData
  matchesData: RoundMatchesData
}) {
  const { highlight } = useParams()

  const orderedBestBenchData = typedOrderBy(Object.values(crewData), ['pointsAverage'], ['desc'])
  if (isEmpty(orderedBestBenchData)) return null

  const first = orderedBestBenchData[0]
  orderedBestBenchData.shift()

  return (
    <SummaryContainer id={ELEMENT_ID} title="Melhor banco" focus={highlight === ELEMENT_ID}>
      <ListHotspot
        imgName={`best-bench_${first.apelido}`}
        name={first.apelido}
        imgSrc={first.foto ?? ''}
        data={renderPointsAverageText(first.pointsAverage, false)}
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
        {take(orderedBestBenchData, 9).map((athlete, idx) => (
          <ListItem
            key={uniqueId(athlete.atleta_id.toString())}
            name={athlete.apelido}
            imgSrc={athlete.foto ?? ''}
            imgSize={45}
            data={renderPointsAverageText(athlete.pointsAverage)}
            position={idx + 2}
          />
        ))}
      </StatisticsList>
    </SummaryContainer>
  )
}
