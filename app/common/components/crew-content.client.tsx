'use client'

import { useState, ReactElement } from 'react'
import { IconCards, IconTable } from '@tabler/icons-react'
import { Switch } from '@mantine/core'
import AthleteList from './athlete/athlete-list.client'
import { getFootballTeamBadgeLink, getFootballTeamName } from '@/app/helpers/teams'
import { getPositionName } from '@/app/helpers/positions'
import isNil from 'lodash/isNil'
import orderBy from 'lodash/orderBy'
import { AthleteTable } from './athlete/athlete-table.client'
import { AthleteTableData, AthleteTableDataWithoutMatchKey } from './athlete/types'
import { ClubStatistics, CrewStatistics, RenderedAthlete } from '../types/athlete'
import Image from 'next/image'
import { PositionsStatistics } from '../types/position'
import { Flex } from './flex'
import { FilterContextProvider } from '../contexts/filter-context.client'
import { CAST_TIMES_OPTION, POINTS_AVERAGE_OPTION } from '@/app/constants/statistics'

function handleTableNumberValues(numberValue: number) {
  if (isNil(numberValue))
    return 0

  if (isFinite(numberValue))
    return numberValue

  return 0
}

function athleteTableDataFactory(athlete: RenderedAthlete): AthleteTableDataWithoutMatchKey {
  return {
    id: athlete.atleta_id,
    photoUrl: athlete?.foto ?? '',
    name: athlete.apelido,
    club: getFootballTeamName(athlete.clube_id),
    clubBadgeUrl: getFootballTeamBadgeLink(athlete.clube_id),
    position: getPositionName(athlete.posicao_id),
    highestPoint: athlete.highestPoint,
    sumOfPlayedMinutes: handleTableNumberValues(athlete.sumOfPlayedMinutes),
    averageMinutesPerRound: athlete.averageMinutesPerRound,
    pointsAverage: athlete.pointsAverage,
    pointsAverageHome: athlete.home.average,
    pointsAverageAway: athlete.away.average,
    finishes: handleTableNumberValues(athlete.finishes),
    finishesToScore: handleTableNumberValues(athlete.finishesToScore),
    goals: handleTableNumberValues(athlete.goals),
    defenses: handleTableNumberValues(athlete.defenses),
    goalsAgainst: handleTableNumberValues(athlete.goalsAgainst),
    defensesToSufferGoal: handleTableNumberValues(athlete.defensesToSufferGoal),
    minutesToScore: handleTableNumberValues(athlete.minutesToScore),
    victoriesAverage: handleTableNumberValues(athlete.victoriesAverage * 100),
    castTimes: athlete.castTimes,
    captainTimes: athlete.captainTimes
  }
}

export function makeAthleteData(crew: CrewStatistics) {
  const athleteData: AthleteTableDataWithoutMatchKey[] = []

  Object.values(crew).forEach(athlete =>
    athleteData.push(athleteTableDataFactory(athlete))
  )

  return athleteData as AthleteTableData[]
}

function StatisticsContainer({ children, title }: { children: ReactElement | ReactElement[], title: string }) {
  return (
    <div className="w-full rounded-md text-white bg-zinc-900 py-4 px-6">
      <div className="mt-[-0.175rem] mb-4">{title}</div>
      <Flex justify="between">
        {children}
      </Flex>
    </div>
  )
}


export function CrewContent(
  { athletes, bench, clubs, positions }:
  {
    athletes: CrewStatistics,
    bench: CrewStatistics,
    clubs: ClubStatistics,
    positions: PositionsStatistics
  }
) {
  const [showTable, setShowTable] = useState(false)

  return (
    <>
      <Flex direction="column" gap="sm">
        <StatisticsContainer title="Percentual de pontos por clubes">
          {
            orderBy(Object.values(clubs), 'pointsPercentage', 'desc').map(
              (club: ClubStatistics[0]) => (
                <Flex key={club.id} align="center" gap="sm" direction="column">
                  <Image
                    alt={getFootballTeamName(club.id)}
                    src={getFootballTeamBadgeLink(club.id)}
                    width={30}
                    height={30}
                  />
                  {club.pointsPercentage.toFixed(1)}%
                </Flex>
              )
            )
          }
        </StatisticsContainer>
        <StatisticsContainer title="Percentual de pontos por posição">
          {
            orderBy(Object.values(positions), 'pointsPercentage', 'desc').map(
              (position: PositionsStatistics[0]) => (
                <Flex key={position.id} gap="sm" align="center">
                  {getPositionName(position.id)}: {position.pointsPercentage.toFixed(1)}%
                </Flex>
              )
            )
          }
        </StatisticsContainer>
      </Flex>
      <Switch
        size="md"
        onLabel={<IconTable size={16} stroke={2.5} />}
        offLabel={<IconCards size={16} stroke={2.5} />}
        onChange={() => setShowTable(prevState => !prevState)}
      />
      {
        showTable
          ? (
            <AthleteTable
              athletes={makeAthleteData(athletes)}
              benchAthletes={makeAthleteData(bench)}
              type="athlete"
            />
          )
          : (
            <FilterContextProvider initialStateValue={[CAST_TIMES_OPTION, POINTS_AVERAGE_OPTION]}>
              <AthleteList
                title="Titulares"
                athletes={athletes}
              />
              <AthleteList
                title="Reservas"
                isBench
                athletes={bench}
              />
            </FilterContextProvider>
          )
      }
    </>
  )
}