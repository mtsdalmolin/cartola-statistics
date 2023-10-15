import { typedOrderBy } from '@/app/helpers/typed-lodash'
import { RoundMatchesData } from '@/app/services/types'

import { isEmpty, take } from 'lodash'

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

export function MoreRedCards<TCrewData extends CrewStatistics>({
  crewData,
  matchesData
}: {
  crewData: TCrewData
  matchesData: RoundMatchesData
}) {
  const orderedMoreRedCardsData = typedOrderBy(
    Object.values(crewData),
    'scout.CV' as any,
    'desc'
  ).filter((athlete) => athlete.scout?.CV ?? 0 > 0)

  if (orderedMoreRedCardsData.length === 0) return null

  const first = orderedMoreRedCardsData[0]
  orderedMoreRedCardsData.shift()
  return (
    <SummaryContainer title="Cartões vermelhos">
      <>
        <ListHotspot
          name={first.apelido}
          imgSrc={first.foto ?? ''}
          data={renderCardsText(first.scout?.CV ?? 0, false)}
          details={
            <AnimatedStatsRoundMatchesResult
              clubId={first.clube_id}
              matchesData={matchesData}
              statRounds={first.cardsRounds.red}
              statText="cart."
              isAnimated={Object.keys(first.cardsRounds.red).length > 5}
            />
          }
        />

        {!isEmpty(orderedMoreRedCardsData) ? (
          <StatisticsList>
            {take(orderedMoreRedCardsData, 9).map((athlete, idx) => (
              <ListItem
                key={athlete.atleta_id}
                name={athlete.apelido}
                imgSrc={athlete.foto ?? ''}
                imgSize={45}
                data={renderCardsText(athlete.scout?.CV ?? 0)}
                position={idx + 2}
              />
            ))}
          </StatisticsList>
        ) : null}
      </>
    </SummaryContainer>
  )
}