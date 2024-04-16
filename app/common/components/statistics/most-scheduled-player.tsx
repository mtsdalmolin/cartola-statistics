import { useParams } from 'next/navigation'

import { HIGHLIGHT_TO_PARAM } from '@/app/constants/highlight'
import { TECNICO } from '@/app/constants/positions'
import { typedOrderBy } from '@/app/helpers/typed-lodash'
import { RoundMatchesData } from '@/app/services/types'

import { take, uniqueId } from 'lodash'

import { CrewStatistics } from '../../types/athlete'
import { RoundMatchesResult } from './details/round-matches-result'
import { StatisticsList } from './list'
import { ListHotspot } from './list/hotspot'
import { ListItem } from './list/item'
import { SummaryContainer } from './summary-container'

const ELEMENT_ID = HIGHLIGHT_TO_PARAM['most-scheduled-player']

function renderCastTimesText(castTimes: number) {
  return `${castTimes} vez${castTimes > 1 ? 'es' : ''}`
}

export function MostScheduledPlayer<TCrewData extends CrewStatistics>({
  crewData,
  matchesData
}: {
  crewData: TCrewData
  matchesData: RoundMatchesData
}) {
  const { highlight } = useParams()

  const mostScheduledPlayerData = typedOrderBy(Object.values(crewData), 'castTimes', 'desc').filter(
    (athlete) => athlete.posicao_id !== TECNICO
  )

  if (mostScheduledPlayerData.length === 0) return null

  const first = mostScheduledPlayerData[0]
  mostScheduledPlayerData.shift()

  return (
    <SummaryContainer
      id={ELEMENT_ID}
      title="Jogador mais escalado"
      focus={highlight === ELEMENT_ID}
    >
      <ListHotspot
        imgName={`most-scheduled-player_${first.apelido}`}
        name={first.apelido}
        imgSrc={first.foto ?? ''}
        data={renderCastTimesText(first.castTimes)}
        details={
          <RoundMatchesResult
            clubId={first.clube_id}
            roundIds={first.castRounds}
            matchesData={matchesData}
            isAnimated={first.castRounds.length > 5}
          />
        }
      />

      <StatisticsList>
        {take(mostScheduledPlayerData, 9).map((athlete, idx) => (
          <ListItem
            key={uniqueId(athlete.atleta_id.toString())}
            name={athlete.apelido}
            imgSrc={athlete.foto ?? ''}
            imgSize={45}
            data={renderCastTimesText(athlete.castTimes)}
            position={idx + 2}
          />
        ))}
      </StatisticsList>
    </SummaryContainer>
  )
}
