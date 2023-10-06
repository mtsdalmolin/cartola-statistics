import { ReactNode } from 'react'

import { typedOrderBy } from '@/app/helpers/typed-lodash'
import { Tooltip } from '@mantine/core'

import { take } from 'lodash'

import { CrewStatistics } from '../../types/athlete'
import { Flex } from '../flex'
import { StatisticsList } from './list'
import { ListHotspot } from './list/hotspot'
import { ListItem } from './list/item'
import { SummaryContainer } from './summary-container'

function renderCaptainTimesText(captainTimes: number) {
  return `${captainTimes} vez${captainTimes > 1 ? 'es' : ''}`
}

function HotspotTooltipLabel<TRounds extends any[]>({
  roundsAsCaptain
}: {
  roundsAsCaptain: TRounds
}) {
  let captainRoundsStatistics: ReactNode[] = []

  roundsAsCaptain.forEach((roundData) => {
    captainRoundsStatistics.push(
      <div>
        Rodada: {roundData.round} - Pontos: {roundData.points.toFixed(2)}
      </div>
    )
  })

  return <Flex direction="column">{captainRoundsStatistics}</Flex>
}

export function MostRoundsAsCaptain<TCrewData extends CrewStatistics>({
  crewData
}: {
  crewData: TCrewData
}) {
  const mostRoundsAsCaptainData = typedOrderBy(Object.values(crewData), 'captainTimes', 'desc')
  const first = mostRoundsAsCaptainData[0]
  mostRoundsAsCaptainData.shift()
  return (
    <SummaryContainer title="Mais escalado como capitão">
      <ListHotspot
        name={first.apelido}
        imgSrc={first.foto ?? ''}
        data={
          <Tooltip label={<HotspotTooltipLabel roundsAsCaptain={first.captainRounds} />} multiline>
            <span>{renderCaptainTimesText(first.captainTimes)}</span>
          </Tooltip>
        }
      />

      <StatisticsList>
        {take(mostRoundsAsCaptainData, 9).map((athlete, idx) => (
          <ListItem
            key={athlete.atleta_id}
            name={athlete.apelido}
            imgSrc={athlete.foto ?? ''}
            imgSize={45}
            data={
              <Tooltip
                label={<HotspotTooltipLabel roundsAsCaptain={athlete.captainRounds} />}
                multiline
              >
                <span>{renderCaptainTimesText(athlete.captainTimes)}</span>
              </Tooltip>
            }
            position={idx + 2}
          />
        ))}
      </StatisticsList>
    </SummaryContainer>
  )
}
