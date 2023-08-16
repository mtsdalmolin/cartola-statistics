"use client"

import { useState } from "react"
import { IconCards, IconTable } from "@tabler/icons-react"
import { Switch } from "@mantine/core"
import { type CrewStatistics, AthleteTableData, RenderedAthlete } from "../page"
import AthleteList from "./athlete-list.client"
import { AthleteTable } from "./athlete-table.client"
import { getFootballTeamBadgeLink, getFootballTeamName } from "@/app/helpers/teams"
import { getPositionName } from "@/app/helpers/positions"
import isNil from 'lodash/isNil'

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
    photoUrl: athlete.foto,
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

export function CrewContent({ athletes, bench }: { athletes: CrewStatistics, bench: CrewStatistics }) {
  const [showTable, setShowTable] = useState(false)

  return (
    <>
      <Switch
        size="md"
        onLabel={<IconTable size={16} stroke={2.5} />}
        offLabel={<IconCards size={16} stroke={2.5} />}
        onChange={() => setShowTable(prevState => !prevState)}
      />
      {
        showTable
          ? (
            <AthleteTable athletes={makeAthleteData(athletes)} />
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