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

const ELEMENT_ID = HIGHLIGHT_TO_PARAM['more-tackles']

function renderTacklesText(numberOfCards: number, isAbbreviated = true) {
  if (isAbbreviated) return `${numberOfCards} des.`

  return `${numberOfCards} desarme${numberOfCards > 1 ? 's' : ''}`
}

export function MoreTackles<TCrewData extends CrewStatistics>({
  crewData,
  matchesData
}: {
  crewData: TCrewData
  matchesData: RoundMatchesData
}) {
  const { highlight } = useParams()

  const orderedMoreTacklesData = typedOrderBy(
    Object.values(crewData),
    'scout.DS' as any,
    'desc'
  ).filter((athlete) => athlete.scout?.DS ?? 0 > 0)

  if (orderedMoreTacklesData.length === 0) return null

  const first = orderedMoreTacklesData[0]
  orderedMoreTacklesData.shift()

  return (
    <SummaryContainer id={ELEMENT_ID} title="Mais desarmes" focus={highlight === ELEMENT_ID}>
      <ListHotspot
        imgName={`more-tackles_${first.apelido}`}
        name={first.apelido}
        imgSrc={first.foto ?? ''}
        data={renderTacklesText(first.scout?.DS ?? 0, false)}
        details={
          <AnimatedStatsRoundMatchesResult
            clubId={first.clube_id}
            matchesData={matchesData}
            statRounds={first.tacklesRounds}
            statText="des."
            isAnimated={Object.keys(first.tacklesRounds).length > 5}
          />
        }
      />

      <StatisticsList>
        {take(orderedMoreTacklesData, 9).map((athlete, idx) => (
          <ListItem
            key={uniqueId(athlete.atleta_id.toString())}
            name={athlete.apelido}
            imgSrc={athlete.foto ?? ''}
            imgSize={45}
            data={renderTacklesText(athlete.scout?.DS ?? 0)}
            position={idx + 2}
          />
        ))}
      </StatisticsList>
    </SummaryContainer>
  )
}
