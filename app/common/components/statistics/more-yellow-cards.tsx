import { typedOrderBy } from '@/app/helpers/typed-lodash'
import { RoundMatchesData } from '@/app/services/types'

import { take } from 'lodash'

import { CrewStatistics } from '../../types/athlete'
import { AnimatedStatsRoundMatchesResult } from './details/animated-stats-round-matches-result'
import { StatisticsList } from './list'
import { ListHotspot } from './list/hotspot'
import { ListItem } from './list/item'
import { SummaryContainer } from './summary-container'

function renderCardsText(numberOfCards: number, isAbbreviated = true) {
  if (isAbbreviated) return `${numberOfCards} cart.`

  return `${numberOfCards} cart${numberOfCards > 1 ? 'ões' : 'ão'}`
}

export function MoreYellowCards<TCrewData extends CrewStatistics>({
  crewData,
  matchesData
}: {
  crewData: TCrewData
  matchesData: RoundMatchesData
}) {
  const orderedMoreYellowCardsData = typedOrderBy(
    Object.values(crewData),
    'scout.CA' as any,
    'desc'
  ).filter((athlete) => athlete.scout?.CA ?? 0 > 0)
  const first = orderedMoreYellowCardsData[0]
  orderedMoreYellowCardsData.shift()
  return (
    <SummaryContainer title="Cartões amarelos">
      <ListHotspot
        imgName={`more-yellow-cards_${first.apelido}`}
        name={first.apelido}
        imgSrc={first.foto ?? ''}
        data={renderCardsText(first.scout?.CA ?? 0, false)}
        details={
          <AnimatedStatsRoundMatchesResult
            clubId={first.clube_id}
            matchesData={matchesData}
            statRounds={first.cardsRounds.yellow}
            statText="cart."
            isAnimated={Object.keys(first.cardsRounds.yellow).length > 5}
          />
        }
      />

      <StatisticsList>
        {take(orderedMoreYellowCardsData, 9).map((athlete, idx) => (
          <ListItem
            key={athlete.atleta_id}
            name={athlete.apelido}
            imgSrc={athlete.foto ?? ''}
            imgSize={45}
            data={renderCardsText(athlete.scout?.CA ?? 0)}
            position={idx + 2}
          />
        ))}
      </StatisticsList>
    </SummaryContainer>
  )
}
