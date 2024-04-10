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

const ELEMENT_ID = HIGHLIGHT_TO_PARAM['participation-in-goals']

function renderParticipationInGoalsText(participation: number, isAbbreviated = true) {
  if (isAbbreviated) return `${participation} part.`
  return `${participation} participaç${participation > 1 ? 'ões' : 'ão'}`
}

export function ParticipationInGoals<TCrewData extends CrewStatistics>({
  crewData,
  matchesData
}: {
  crewData: TCrewData
  matchesData: RoundMatchesData
}) {
  const { highlight } = useParams()

  const orderedParticipationInGoalsData = typedOrderBy(
    Object.values(crewData),
    'participationInGoals',
    'desc'
  ).filter((athlete) => athlete.participationInGoals)

  if (orderedParticipationInGoalsData.length === 0) return null

  const first = orderedParticipationInGoalsData[0]
  orderedParticipationInGoalsData.shift()

  return (
    <SummaryContainer
      id={ELEMENT_ID}
      title="Participações em gols"
      focus={highlight === ELEMENT_ID}
    >
      <ListHotspot
        imgName={`participation-in-goals_${first.apelido}`}
        name={first.apelido}
        imgSrc={first.foto ?? ''}
        data={renderParticipationInGoalsText(first.participationInGoals, false)}
        details={
          <AnimatedStatsRoundMatchesResult
            clubId={first.clube_id}
            matchesData={matchesData}
            statRounds={first.participationInGoalsRounds}
            statText="part."
            isAnimated={Object.keys(first.participationInGoalsRounds).length > 5}
          />
        }
      />

      <StatisticsList>
        {take(orderedParticipationInGoalsData, 9).map((athlete, idx) => (
          <ListItem
            key={uniqueId(athlete.atleta_id.toString())}
            name={athlete.apelido}
            imgSrc={athlete.foto ?? ''}
            imgSize={45}
            data={renderParticipationInGoalsText(athlete.participationInGoals)}
            position={idx + 2}
          />
        ))}
      </StatisticsList>
    </SummaryContainer>
  )
}
