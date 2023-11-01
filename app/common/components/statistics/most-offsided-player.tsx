import { typedOrderBy } from '@/app/helpers/typed-lodash'
import { RoundMatchesData } from '@/app/services/types'

import { take } from 'lodash'

import { CrewStatistics } from '../../types/athlete'
import { AnimatedStatsRoundMatchesResult } from './details/animated-stats-round-matches-result'
import { StatisticsList } from './list'
import { ListHotspot } from './list/hotspot'
import { ListItem } from './list/item'
import { SummaryContainer } from './summary-container'

function renderOffsidesText(numberOfCards: number, isAbbreviated = true) {
  if (isAbbreviated) return `${numberOfCards} imp.`

  return `${numberOfCards} impedimento${numberOfCards > 1 ? 's' : ''}`
}

export function MostOffsidedPlayer<TCrewData extends CrewStatistics>({
  crewData,
  matchesData
}: {
  crewData: TCrewData
  matchesData: RoundMatchesData
}) {
  const orderedMostOffsidedPlayerData = typedOrderBy(
    Object.values(crewData),
    'scout.I' as any,
    'desc'
  ).filter((athlete) => athlete.scout?.I ?? 0 > 0)

  if (orderedMostOffsidedPlayerData.length === 0) return null

  const first = orderedMostOffsidedPlayerData[0]
  orderedMostOffsidedPlayerData.shift()
  return (
    <SummaryContainer title="Mais impedido">
      <ListHotspot
        imgName={`most-offside-player-${first.apelido}`}
        name={first.apelido}
        imgSrc={first.foto ?? ''}
        data={renderOffsidesText(first.scout?.I ?? 0, false)}
        details={
          <AnimatedStatsRoundMatchesResult
            clubId={first.clube_id}
            matchesData={matchesData}
            statRounds={first.offsideRounds}
            statText="imp."
            isAnimated={Object.keys(first.offsideRounds).length > 5}
          />
        }
      />

      <StatisticsList>
        {take(orderedMostOffsidedPlayerData, 9).map((athlete, idx) => (
          <ListItem
            key={athlete.atleta_id}
            name={athlete.apelido}
            imgSrc={athlete.foto ?? ''}
            imgSize={45}
            data={renderOffsidesText(athlete.scout?.I ?? 0)}
            position={idx + 2}
          />
        ))}
      </StatisticsList>
    </SummaryContainer>
  )
}
