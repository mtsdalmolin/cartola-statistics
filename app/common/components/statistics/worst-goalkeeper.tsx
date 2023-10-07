import { typedOrderBy } from '@/app/helpers/typed-lodash'
import { getRoundsData } from '@/app/services/cartola-api'

import { take } from 'lodash'

import { CrewStatistics } from '../../types/athlete'
import { Flex } from '../flex'
import { MatchVersus } from '../match-versus'
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

async function GoalsScoredMatches({ clubId, roundIds }: { clubId: number; roundIds: number[] }) {
  const matchesData = await getRoundsData(roundIds)
  return (
    <Flex direction="column">
      {roundIds.map((roundId) => (
        <Flex key={roundId} direction="column">
          <span className="text-xs">Rodada {roundId}</span>
          <MatchVersus match={matchesData[roundId][clubId]} badgeSize={25} />
        </Flex>
      ))}
    </Flex>
  )
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
