import { typedOrderBy } from '@/app/helpers/typed-lodash'
import { Progress } from '@mantine/core'

import { take } from 'lodash'

import { CrewStatistics } from '../../types/athlete'
import { StatisticsList } from './list'
import { ListHotspot } from './list/hotspot'
import { ListItem } from './list/item'
import { SummaryContainer } from './summary-container'

function renderCaptainTimesText(captainTimes: number) {
  return `${captainTimes} vez${captainTimes > 1 ? 'es' : ''}`
}

function getPointsPercentage(points: number, divider: number) {
  return (points * 100) / divider
}

function CaptainStatistics<TRounds extends any[]>({
  roundsAsCaptain
}: {
  roundsAsCaptain: TRounds
}) {
  return (
    <div className="grow-[3] w-fit">
      {roundsAsCaptain.map((roundData) => {
        let diffBetweenPoints = roundData.points - roundData.rawPoints
        let differencePercentage = getPointsPercentage(diffBetweenPoints, roundData.points)
        let rawPointsPercentage = getPointsPercentage(roundData.rawPoints, roundData.points)

        return (
          <div key={`${roundData.round}-${roundData.points}`}>
            <div className="flex justify-between w-full text-xs text-left">
              <span>Rodada {roundData.round}</span>
              <span>{roundData.points.toFixed(1)} pts</span>
            </div>
            <Progress
              radius="xs"
              size="xl"
              sections={[
                {
                  value: rawPointsPercentage,
                  color: '#104936',
                  label: `${roundData.rawPoints.toFixed(1)} pts`,
                  tooltip: `Pontos desconsiderando capitania: ${roundData.rawPoints.toFixed(1)}`
                },
                {
                  value: differencePercentage,
                  color: '#1c7a5b',
                  label: `+${diffBetweenPoints.toFixed(1)}`,
                  tooltip: `Pontos como capitão: ${roundData.points.toFixed(1)}`
                }
              ]}
            />
          </div>
        )
      })}
    </div>
  )
}

export function MostRoundsAsCaptain<TCrewData extends CrewStatistics>({
  crewData
}: {
  crewData: TCrewData
}) {
  const mostRoundsAsCaptainData = typedOrderBy(
    Object.values(crewData).filter((athlete) => athlete.captainTimes > 0),
    'captainTimes',
    'desc'
  )
  const first = mostRoundsAsCaptainData[0]
  mostRoundsAsCaptainData.shift()
  return (
    <SummaryContainer title="Mais escalado como capitão">
      <ListHotspot
        imgName={`most-rounds-as-captain_${first.apelido}`}
        name={first.apelido}
        imgSrc={first.foto ?? ''}
        data={renderCaptainTimesText(first.captainTimes)}
        details={<CaptainStatistics roundsAsCaptain={first.captainRounds} />}
      />

      <StatisticsList>
        {take(mostRoundsAsCaptainData, 9).map((athlete, idx) => (
          <ListItem
            key={athlete.atleta_id}
            name={athlete.apelido}
            imgSrc={athlete.foto ?? ''}
            imgSize={45}
            data={renderCaptainTimesText(athlete.captainTimes)}
            position={idx + 2}
          />
        ))}
      </StatisticsList>
    </SummaryContainer>
  )
}
