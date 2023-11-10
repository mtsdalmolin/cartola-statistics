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

const ELEMENT_ID = HIGHLIGHT_TO_PARAM['more-fouls']

function renderFoulsText(fouls: number, isAbbreviated = true) {
  if (isAbbreviated) return `${fouls} falta${fouls > 1 ? 's' : ''}`
  return `${fouls} falta${fouls > 1 ? 's' : ''} cometida${fouls > 1 ? 's' : ''}`
}

export function MoreFouls<TCrewData extends CrewStatistics>({
  crewData,
  matchesData
}: {
  crewData: TCrewData
  matchesData: RoundMatchesData
}) {
  const { highlight } = useParams()

  const orderedMoreFoulsData = typedOrderBy(Object.values(crewData), 'fouls', 'desc').filter(
    (athlete) => athlete.fouls
  )

  if (orderedMoreFoulsData.length === 0) return null

  const first = orderedMoreFoulsData[0]
  orderedMoreFoulsData.shift()

  return (
    <SummaryContainer
      id={ELEMENT_ID}
      title="Mais faltas cometidas"
      focus={highlight === ELEMENT_ID}
    >
      <ListHotspot
        imgName={`more-fouls_${first.apelido}`}
        name={first.apelido}
        imgSrc={first.foto ?? ''}
        data={renderFoulsText(first.fouls, false)}
        details={
          <AnimatedStatsRoundMatchesResult
            clubId={first.clube_id}
            matchesData={matchesData}
            statRounds={first.foulsRounds}
            statText="faltas"
            isAnimated={Object.keys(first.foulsRounds).length > 5}
          />
        }
      />

      <StatisticsList>
        {take(orderedMoreFoulsData, 9).map((athlete, idx) => (
          <ListItem
            key={athlete.atleta_id}
            name={athlete.apelido}
            imgSrc={athlete.foto ?? ''}
            imgSize={45}
            data={renderFoulsText(athlete.fouls)}
            position={idx + 2}
          />
        ))}
      </StatisticsList>
    </SummaryContainer>
  )
}
