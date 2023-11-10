import { useParams } from 'next/navigation'

import { HIGHLIGHT_TO_PARAM } from '@/app/constants/highlight'
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

const ELEMENT_ID = HIGHLIGHT_TO_PARAM['best-coach']

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

function renderPointsAverageText(pointsAverage: number, isAbbreviated = true) {
  return `${pointsAverage.toFixed(1)} ${isAbbreviated ? 'pts.' : 'pontos'}`
}

export function BestCoach<TCrewData extends CrewStatistics>({
  crewData,
  matchesData
}: {
  crewData: TCrewData
  matchesData: RoundMatchesData
}) {
  const { highlight } = useParams()

  const orderedBestCoachData = typedOrderBy(
    Object.values(crewData).filter(
      (athlete) => isCoach(athlete.posicao_id) && athlete.victoriesAverage
    ),
    ['pointsAverage'],
    ['desc']
  )

  if (orderedBestCoachData.length === 0) return null

  const first = orderedBestCoachData[0]
  orderedBestCoachData.shift()

  return (
    <SummaryContainer id={ELEMENT_ID} title="Melhor técnico" focus={highlight === ELEMENT_ID}>
      <ListHotspot
        imgName={`best-coach_${first.apelido}`}
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
            <span>{renderPointsAverageText(first.pointsAverage, false)}</span>
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
                <span>{renderPointsAverageText(athlete.pointsAverage)}</span>
              </Tooltip>
            }
            position={idx + 2}
          />
        ))}
      </StatisticsList>
    </SummaryContainer>
  )
}
