import { getRoundResults } from '@/app/helpers/formatters/cartola'
import { isCoach } from '@/app/helpers/positions'
import { typedOrderBy } from '@/app/helpers/typed-lodash'
import { RoundMatchesData } from '@/app/services/types'
import { Tooltip } from '@mantine/core'

import { countBy } from 'lodash'

import { CrewStatistics } from '../../types/athlete'
import { RoundMatchesResult } from './details/round-matches-result'
import { StatisticsList } from './list'
import { ListHotspot } from './list/hotspot'
import { ListItem } from './list/item'
import { SummaryContainer } from './summary-container'

function renderVictoriesAverageTooltipLabel(castTimes: number, results: number[]) {
  const categorizedResults = countBy(results, Math.floor)
  return (
    <div>
      <div>{`${castTimes} escalaç${castTimes > 1 ? 'ões' : 'ão'}`}</div>
      {categorizedResults['3'] > 0 ? (
        <div>{`${categorizedResults['3']} vitória${categorizedResults['3'] > 1 ? 's' : ''}`}</div>
      ) : null}
      {categorizedResults['1'] > 0 ? (
        <div>{`${categorizedResults['1'] ?? 0} empate${
          categorizedResults['1'] > 1 ? 's' : ''
        }`}</div>
      ) : null}
      {categorizedResults['0'] > 0 ? (
        <div>{`${categorizedResults['0'] ?? 0} derrota${
          categorizedResults['0'] > 1 ? 's' : ''
        }`}</div>
      ) : null}
    </div>
  )
}

function renderVictoriesAverageText(victoriesAverage: number, isAbbreviated = true) {
  return `${(victoriesAverage * 100).toFixed(0)}% ${isAbbreviated ? '' : 'de aprov.'}`
}

export function BestCoach<TCrewData extends CrewStatistics>({
  crewData,
  matchesData
}: {
  crewData: TCrewData
  matchesData: RoundMatchesData
}) {
  const orderedBestCoachData = typedOrderBy(
    Object.values(crewData).filter(
      (athlete) => isCoach(athlete.posicao_id) && athlete.victoriesAverage
    ),
    ['victoriesAverage', 'castTimes'],
    ['desc', 'desc']
  )
  const first = orderedBestCoachData[0]
  orderedBestCoachData.shift()
  return (
    <SummaryContainer title="Melhor técnico">
      <ListHotspot
        imgName={`best-coach-${first.apelido}`}
        name={first.apelido}
        imgSrc={first.foto ?? ''}
        data={
          <Tooltip
            label={renderVictoriesAverageTooltipLabel(
              first.castTimes,
              getRoundResults(first, matchesData)
            )}
            multiline
          >
            <span>{renderVictoriesAverageText(first.victoriesAverage, false)}</span>
          </Tooltip>
        }
        details={
          <RoundMatchesResult
            clubId={first.clube_id}
            matchesData={matchesData}
            roundIds={first.victoriesRoundIds}
            isAnimated={first.victoriesRoundIds.length > 5}
          />
        }
      />

      <StatisticsList>
        {orderedBestCoachData.map((athlete, idx) => (
          <ListItem
            key={athlete.atleta_id}
            name={athlete.apelido}
            imgSrc={athlete.foto ?? ''}
            imgSize={45}
            data={
              <Tooltip
                label={renderVictoriesAverageTooltipLabel(
                  athlete.castTimes,
                  getRoundResults(athlete, matchesData)
                )}
              >
                <span>{renderVictoriesAverageText(athlete.victoriesAverage)}</span>
              </Tooltip>
            }
            position={idx + 2}
          />
        ))}
      </StatisticsList>
    </SummaryContainer>
  )
}
