import { useParams } from 'next/navigation'

import { HIGHLIGHT_TO_PARAM } from '@/app/constants/highlight'
import { typedOrderBy } from '@/app/helpers/typed-lodash'
import { RoundMatchesData } from '@/app/services/types'
import { Tooltip } from '@mantine/core'

import { take, uniqueId } from 'lodash'

import { CrewStatistics } from '../../types/athlete'
import { AnimatedStatsRoundMatchesResult } from './details/animated-stats-round-matches-result'
import { StatisticsList } from './list'
import { ListHotspot } from './list/hotspot'
import { ListItem } from './list/item'
import { SummaryContainer } from './summary-container'

const ELEMENT_ID = HIGHLIGHT_TO_PARAM['finishes-on-post']

function renderFinishesOnPost(assists: number, isAbbreviated = true) {
  if (isAbbreviated)
    return (
      <Tooltip label="Bolas na trave">
        <div>{assists} BT</div>
      </Tooltip>
    )
  return `${assists} bola${assists > 1 ? 's' : ''} na trave`
}

export function FinishesOnPost<TCrewData extends CrewStatistics>({
  crewData,
  matchesData
}: {
  crewData: TCrewData
  matchesData: RoundMatchesData
}) {
  const { highlight } = useParams()

  const orderedFinishesOnPostData = typedOrderBy(
    Object.values(crewData),
    'finishesOnPost',
    'desc'
  ).filter((athlete) => athlete.finishesOnPost)

  if (orderedFinishesOnPostData.length === 0) return null

  const first = orderedFinishesOnPostData[0]
  orderedFinishesOnPostData.shift()

  return (
    <SummaryContainer id={ELEMENT_ID} title="Bolas na trave" focus={highlight === ELEMENT_ID}>
      <ListHotspot
        imgName={`finishes-on-post_${first.apelido}`}
        name={first.apelido}
        imgSrc={first.foto ?? ''}
        data={renderFinishesOnPost(first.assists, false)}
        details={
          <AnimatedStatsRoundMatchesResult
            clubId={first.clube_id}
            matchesData={matchesData}
            statRounds={first.finishesOnPostRounds}
            statText="BT"
            isAnimated={Object.keys(first.finishesOnPostRounds).length > 5}
          />
        }
      />

      <StatisticsList>
        {take(orderedFinishesOnPostData, 9).map((athlete, idx) => (
          <ListItem
            key={uniqueId(athlete.atleta_id.toString())}
            name={athlete.apelido}
            imgSrc={athlete.foto ?? ''}
            imgSize={45}
            data={renderFinishesOnPost(athlete.finishesOnPost)}
            position={idx + 2}
          />
        ))}
      </StatisticsList>
    </SummaryContainer>
  )
}
