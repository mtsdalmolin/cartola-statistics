"use client"

import { useState } from "react"
import { IconCards, IconTable } from "@tabler/icons-react"
import { Flex, Switch } from "@mantine/core"
import AthleteList from "./athlete/athlete-list.client"
import { getFootballTeamBadgeLink, getFootballTeamName } from "@/app/helpers/teams"
import { getPositionName } from "@/app/helpers/positions"
import isNil from 'lodash/isNil'
import orderBy from 'lodash/orderBy'
import { AthleteTable } from "./athlete/athlete-table.client"
import { AthleteTableData } from "./athlete/types"
import { ClubStatistics, CrewStatistics, RenderedAthlete } from "../types/athlete"
import Image from "next/image"

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

export function CrewContent(
  { athletes, bench, clubs }:
  { athletes: CrewStatistics, bench: CrewStatistics, clubs: ClubStatistics }
) {
  const [showTable, setShowTable] = useState(false)

  return (
    <>
      <div className="rounded-md bg-zinc-900 py-4 px-6">
        <div className="mt-[-0.175rem] mb-4">Percentual de pontos por clubes</div>
        <div className="flex justify-between">
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
        </div>
      </div>
      <Switch
        size="md"
        onLabel={<IconTable size={16} stroke={2.5} />}
        offLabel={<IconCards size={16} stroke={2.5} />}
        onChange={() => setShowTable(prevState => !prevState)}
      />
      {
        showTable
          ? (
            <AthleteTable athletes={makeAthleteData(athletes)} benchAthletes={makeAthleteData(bench)} type="athlete" />
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