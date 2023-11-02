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

const ELEMENT_ID = HIGHLIGHT_TO_PARAM['more-defenses']

function renderDefensesText(defenses: number, isAbbreviated = true) {
  if (isAbbreviated) return `${defenses} def.`
  return `${defenses} defesa${defenses > 1 ? 's' : ''}`
}

export function MoreDefenses<TCrewData extends CrewStatistics>({
  crewData,
  matchesData
}: {
  crewData: TCrewData
  matchesData: RoundMatchesData
}) {
  const { highlight } = useParams()

  const orderedDefenseEfficiencyData = typedOrderBy(
    Object.values(crewData),
    'defenses',
    'desc'
  ).filter((athlete) => athlete.defenses)
  const first = orderedDefenseEfficiencyData[0]
  orderedDefenseEfficiencyData.shift()

  return (
    <SummaryContainer id={ELEMENT_ID} title="Mais defesas" focus={highlight === ELEMENT_ID}>
      <ListHotspot
        imgName={`more-defenses_${first.apelido}`}
        name={first.apelido}
        imgSrc={first.foto ?? ''}
        data={renderDefensesText(first.defenses, false)}
        details={
          <AnimatedStatsRoundMatchesResult
            clubId={first.clube_id}
            matchesData={matchesData}
            statRounds={first.defensesRounds}
            statText="def."
            isAnimated={Object.keys(first.defensesRounds).length > 5}
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
            data={renderDefensesText(athlete.defenses)}
            position={idx + 2}
          />
        ))}
      </StatisticsList>
    </SummaryContainer>
  )
}
