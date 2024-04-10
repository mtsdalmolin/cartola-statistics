import { useParams } from 'next/navigation'

import { HIGHLIGHT_TO_PARAM } from '@/app/constants/highlight'
import { typedOrderBy } from '@/app/helpers/typed-lodash'
import { RoundMatchesData } from '@/app/services/types'

import { take, uniqueId } from 'lodash'

import { CrewStatistics } from '../../types/athlete'
import { RoundMatchesResult } from './details/round-matches-result'
import { StatisticsList } from './list'
import { ListHotspot } from './list/hotspot'
import { ListItem } from './list/item'
import { SummaryContainer } from './summary-container'

const ELEMENT_ID = HIGHLIGHT_TO_PARAM['worst-goalkeeper']

function renderGoalsConcededText(goalsConceded: number, isAbbreviated = true) {
  if (isAbbreviated) return `${goalsConceded} gol${goalsConceded > 1 ? 's' : ''}`
  return `${goalsConceded} gol${goalsConceded > 1 ? 's' : ''} sofrido${
    goalsConceded > 1 ? 's' : ''
  }`
}

export function WorstGoalkeeper<TCrewData extends CrewStatistics>({
  crewData,
  matchesData
}: {
  crewData: TCrewData
  matchesData: RoundMatchesData
}) {
  const { highlight } = useParams()

  const orderedWorstGoalkeeperData = typedOrderBy(
    Object.values(crewData),
    'goalsConceded',
    'desc'
  ).filter((athlete) => athlete.goalsConceded)

  if (orderedWorstGoalkeeperData.length === 0) return null

  const first = orderedWorstGoalkeeperData[0]
  orderedWorstGoalkeeperData.shift()

  return (
    <SummaryContainer id={ELEMENT_ID} title="Gols sofridos" focus={highlight === ELEMENT_ID}>
      <ListHotspot
        imgName={`worst-goalkeeper_${first.apelido}`}
        name={first.apelido}
        imgSrc={first.foto ?? ''}
        data={renderGoalsConcededText(first.goalsConceded, false)}
        details={
          <RoundMatchesResult
            clubId={first.clube_id}
            matchesData={matchesData}
            roundIds={first.goalsConcededRoundIds}
            isAnimated={first.goalsConcededRoundIds.length > 5}
          />
        }
      />

      <StatisticsList>
        {take(orderedWorstGoalkeeperData, 9).map((athlete, idx) => (
          <ListItem
            key={uniqueId(athlete.atleta_id.toString())}
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
