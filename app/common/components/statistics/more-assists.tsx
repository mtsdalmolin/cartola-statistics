import { useParams } from 'next/navigation'

import { HIGHLIGHT_TO_PARAM } from '@/app/constants/highlight'
import { typedOrderBy } from '@/app/helpers/typed-lodash'
import { RoundMatchesData } from '@/app/services/types'

import { take } from 'lodash'

import { CrewStatistics } from '../../types/athlete'
import { AnimatedStatsRoundMatchesResult } from './details/animated-stats-round-matches-result'
import { StatisticsList } from './list'
import { ListHotspot } from './list/hotspot'
import { ListItem } from './list/item'
import { SummaryContainer } from './summary-container'

const ELEMENT_ID = HIGHLIGHT_TO_PARAM['more-assists']

function renderAssistsText(defenses: number, isAbbreviated = true) {
  if (isAbbreviated) return `${defenses} assist.`
  return `${defenses} assistência${defenses > 1 ? 's' : ''}`
}

export function MoreAssists<TCrewData extends CrewStatistics>({
  crewData,
  matchesData
}: {
  crewData: TCrewData
  matchesData: RoundMatchesData
}) {
  const { highlight } = useParams()

  const orderedDefenseEfficiencyData = typedOrderBy(
    Object.values(crewData),
    'assists',
    'desc'
  ).filter((athlete) => athlete.assists)
  const first = orderedDefenseEfficiencyData[0]
  orderedDefenseEfficiencyData.shift()

  return (
    <SummaryContainer id={ELEMENT_ID} title="Mais assistências" focus={highlight === ELEMENT_ID}>
      <ListHotspot
        imgName={`more-assists_${first.apelido}`}
        name={first.apelido}
        imgSrc={first.foto ?? ''}
        data={renderAssistsText(first.assists, false)}
        details={
          <AnimatedStatsRoundMatchesResult
            clubId={first.clube_id}
            matchesData={matchesData}
            statRounds={first.assistsRounds}
            statText="assist."
            isAnimated={Object.keys(first.assistsRounds).length > 5}
          />
        }
      />

      <StatisticsList>
        {take(orderedDefenseEfficiencyData, 9).map((athlete, idx) => (
          <ListItem
            key={athlete.atleta_id}
            name={athlete.apelido}
            imgSrc={athlete.foto ?? ''}
            imgSize={45}
            data={renderAssistsText(athlete.assists)}
            position={idx + 2}
          />
        ))}
      </StatisticsList>
    </SummaryContainer>
  )
}
