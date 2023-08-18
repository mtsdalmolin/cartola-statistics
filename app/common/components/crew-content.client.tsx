"use client"

import { useState, ReactElement } from "react"
import { IconCards, IconTable } from "@tabler/icons-react"
import { Switch } from "@mantine/core"
import AthleteList from "./athlete/athlete-list.client"
import { getFootballTeamBadgeLink, getFootballTeamName } from "@/app/helpers/teams"
import { getPositionName } from "@/app/helpers/positions"
import isNil from 'lodash/isNil'
import orderBy from 'lodash/orderBy'
import { AthleteTable } from "./athlete/athlete-table.client"
import { AthleteTableData } from "./athlete/types"
import { ClubStatistics, CrewStatistics, RenderedAthlete } from "../types/athlete"
import Image from "next/image"
import { PositionsStatistics } from "../types/position"

function handleTableNumberValues(numberValue: number) {
  if (isNil(numberValue))
    return 0

  if (isFinite(numberValue))
    return numberValue

  return 0
}

function athleteTableDataFactory(athlete: RenderedAthlete): AthleteTableData {
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
  const athleteData: AthleteTableData[] = []

  Object.values(crew).forEach(athlete =>
    athleteData.push(athleteTableDataFactory(athlete))
  )

  return athleteData
}

function StatisticsContainer({ children, title }: { children: ReactElement | ReactElement[], title: string }) {
  return (
    <div className="rounded-md bg-zinc-900 py-4 px-6">
      <div className="mt-[-0.175rem] mb-4">{title}</div>
      <Flex justify="between">
        {children}
      </Flex>
    </div>
  )
}

type GapValues = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

function setGap(gap?: GapValues) {
  let size = ''

  switch (gap) {
    case 'xs':
      size = '3'
      break
    case 'sm':
      size = '4'
      break
    case 'md':
      size = '6'
      break
    case 'lg':
      size = '8'
      break
    case 'xl':
      size = '10'
      break
    default:
      size = '6'
  }

  return `gap-${size}`
}

type DirectionValues = 'column'

function setDirection(direction?: DirectionValues) {
  return direction === 'column' ? 'flex-col' : ''
}

type AlignOptions = 'start'
  | 'end'
  | 'center'
  | 'baseline'
  | 'stretch'

function setAlignItems(align?: AlignOptions) {
  const ALIGN_OPTIONS = [
    'start',
    'end',
    'center',
    'baseline',
    'stretch',
  ]

  if (!isNil(align) && !ALIGN_OPTIONS.includes(align))
    throw new Error('[Flex] align items should have a valid option')

  return `items-${align || ALIGN_OPTIONS[0]}`
}

type JustifyValues = 'normal'
  | 'start'
  | 'end'
  | 'center'
  | 'between'
  | 'around'
  | 'evenly'
  | 'stretch' 

function setJustify(justify?: JustifyValues) {
  const JUSTIFY_OPTIONS = [
    'normal',
    'start',
    'end',
    'center',
    'between',
    'around',
    'evenly',
    'stretch',
  ]

  if (!isNil(justify) && !JUSTIFY_OPTIONS.includes(justify))
    throw new Error('[Flex] align items should have a valid option')
  
  return `justify-${justify || JUSTIFY_OPTIONS[0]}`
}

function Flex({
  children,
  align,
  direction,
  justify,
  gap
}: {
  children: (ReactElement | string)[] | (ReactElement | string),
  align?: AlignOptions,
  direction?: DirectionValues,
  justify?: JustifyValues
  gap?: GapValues
}) {
  return (
    <div className={`
      flex
      ${setAlignItems(align)}
      ${setDirection(direction)}
      ${setJustify(justify)}
      ${setGap(gap)}
      flex-wrap
    `}>
      {children}
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
                <Flex key={club.id} gap="sm" direction="column" align="center">
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
            <>
              <AthleteList
                title="Titulares"
                athletes={athletes}
              />
              <AthleteList
                title="Reservas"
                isBench
                athletes={bench}
              />
            </>
          )
      }
    </>
  )
}