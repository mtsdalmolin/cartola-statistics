import { typedOrderBy } from '@/app/helpers/typed-lodash'
import { RoundMatchesData } from '@/app/services/types'

import { take } from 'lodash'

import { CrewStatistics } from '../../types/athlete'
import { AnimatedStatsRoundMatchesResult } from './details/animated-stats-round-matches-result'
import { StatisticsList } from './list'
import { ListHotspot } from './list/hotspot'
import { ListItem } from './list/item'
import { SummaryContainer } from './summary-container'

function renderGoalsText(numberOfGoals: number) {
  return `${numberOfGoals} gol${numberOfGoals > 1 ? 's' : ''}`
}

export function Artillery<TCrewData extends CrewStatistics>({
  crewData,
  matchesData
}: {
  crewData: TCrewData
  matchesData: RoundMatchesData
}) {
  const orderedArtilleryData = typedOrderBy(Object.values(crewData), 'goals', 'desc').filter(
    (athlete) => athlete.goals > 0
  )
  const first = orderedArtilleryData[0]
  orderedArtilleryData.shift()
  return (
    <SummaryContainer title="Artilharia">
      <ListHotspot
        imgName={`artillery_${first.apelido}`}
        name={first.apelido}
        imgSrc={first.foto ?? ''}
        data={renderGoalsText(first.goals)}
        details={
          <AnimatedStatsRoundMatchesResult
            clubId={first.clube_id}
            matchesData={matchesData}
            statRounds={first.scoredGoalsRounds}
            statText={(scoredGoals) => `gol${scoredGoals > 1 ? 's' : ''}`}
            isAnimated={Object.keys(first.scoredGoalsRounds).length > 5}
          />
        }
      />

      <StatisticsList>
        {take(orderedArtilleryData, 9).map((athlete, idx) => (
          <ListItem
            key={athlete.atleta_id}
            name={athlete.apelido}
            imgSrc={athlete.foto ?? ''}
            imgSize={45}
            data={renderGoalsText(athlete.goals)}
            position={idx + 2}
          />
        ))}
      </StatisticsList>
    </SummaryContainer>
  )
}
