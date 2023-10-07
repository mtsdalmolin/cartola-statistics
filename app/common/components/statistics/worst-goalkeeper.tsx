import { typedOrderBy } from '@/app/helpers/typed-lodash'

import { take } from 'lodash'

import { CrewStatistics } from '../../types/athlete'
import { GoalsScoredMatches } from './details/goals-scored-matches'
import { StatisticsList } from './list'
import { ListHotspot } from './list/hotspot'
import { ListItem } from './list/item'
import { SummaryContainer } from './summary-container'

function renderGoalsConcededText(goalsConceded: number, isAbbreviated = true) {
  if (isAbbreviated) return `${goalsConceded} gol${goalsConceded > 1 ? 's' : ''}`
  return `${goalsConceded} gol${goalsConceded > 1 ? 's' : ''} sofrido${
    goalsConceded > 1 ? 's' : ''
  }`
}

export function WorstGoalkeeper<TCrewData extends CrewStatistics>({
  crewData
}: {
  crewData: TCrewData
}) {
  const orderedWorstGoalkeeperData = typedOrderBy(
    Object.values(crewData),
    'goalsConceded',
    'desc'
  ).filter((athlete) => athlete.goalsConceded)
  const first = orderedWorstGoalkeeperData[0]
  orderedWorstGoalkeeperData.shift()
  return (
    <SummaryContainer title="Gols sofridos">
      <ListHotspot
        name={first.apelido}
        imgSrc={first.foto ?? ''}
        data={renderGoalsConcededText(first.goalsConceded, false)}
        details={
          <GoalsScoredMatches clubId={first.clube_id} roundIds={first.goalsConcededRoundIds} />
        }
      />

      <StatisticsList>
        {take(orderedWorstGoalkeeperData, 9).map((athlete, idx) => (
          <ListItem
            key={athlete.atleta_id}
            name={athlete.apelido}
            imgSrc={athlete.foto ?? ''}
            imgSize={45}
            data={renderGoalsConcededText(athlete.goalsConceded)}
            position={idx + 2}
          />
        ))}
      </StatisticsList>
    </SummaryContainer>
  )
}
