import { isFinite } from "lodash"
import { RenderedAthlete } from "../[teamSlug]/page"
import { POSITIONS, PositionsIds } from "../constants/positions"
import { PositionOption } from "../[teamSlug]/components/athlete-list.client"

export function isGoalkeeper(positionId: number) {
  const gkPositionId = Object.keys(POSITIONS)
    .find((positionId: string) => 
      POSITIONS[Number(positionId)].abreviacao.toLowerCase() === 'gol'
    )

  return Number(gkPositionId) === positionId
}

export function isCoach(positionId: number) {
  const coachPositionId = Object.keys(POSITIONS)
    .find((positionId: string) => 
      POSITIONS[Number(positionId)].abreviacao.toLowerCase() === 'tec'
    )

  return Number(coachPositionId) === positionId
}


export function getPositionAbbreviation(positionId: PositionsIds) {
  return POSITIONS[positionId].abreviacao
}

export function getPositionName(positionId: PositionsIds) {
  return POSITIONS[positionId].nome
}

export function getPositionOptionByValue(positionsOptions: PositionOption[], positionValue: string): PositionOption {
  return positionsOptions.find(position => position.value === positionValue)!
}

export function getAthleteStatisticsByPositionId(athlete: RenderedAthlete) {
  return [
    {
      label: 'Maior pont.',
      title: 'Maior pontuação',
      value: athlete.highestPoint,
      canRender: () => true,
    },
    {
      label: 'Min. jogados',
      title: 'Minutos jogados',
      value: athlete.sumOfPlayedMinutes,
      canRender: () => !isCoach(athlete.posicao_id)
    },
    {
      label: 'Gols',
      title: 'Gols',
      value: athlete.goals,
      canRender: () => !isCoach(athlete.posicao_id) && (!isGoalkeeper(athlete.posicao_id) && athlete.goals > 0)
    },
    {
      label: 'MPG',
      title: 'Minutos para marcar gol',
      value: athlete.minutesToScore.toFixed(1),
      canRender: () => isFinite(athlete.minutesToScore)
    },
    {
      label: "Finalizações",
      title: "Finalizações",
      value: athlete.finishes,
      canRender: () => !isGoalkeeper(athlete.posicao_id) && !isCoach(athlete.posicao_id)
    },
    {
      label: "FPG",
      title: "Finalizações para marcar gols",
      value: athlete.finishesToScore.toFixed(1),
      canRender: () => !isGoalkeeper(athlete.posicao_id) && !isCoach(athlete.posicao_id) && isFinite(athlete.finishesToScore)
    },
    {
      label: 'Defesas',
      title: 'Defesas',
      value: athlete.defenses.toFixed(1),
      canRender: () => isGoalkeeper(athlete.posicao_id)
    },
    {
      label: 'Gols sofridos',
      title: 'Gols sofridos',
      value: athlete.goalsAgainst.toFixed(1),
      canRender: () => isGoalkeeper(athlete.posicao_id)
    },
    {
      label: 'DPG',
      title: 'Defesas para sofrer gols',
      value: athlete.defensesToSufferGoal.toFixed(1),
      canRender: () => isGoalkeeper(athlete.posicao_id) && isFinite(athlete.defensesToSufferGoal)
    },
    {
      label: 'MPM/R',
      title: 'Média de pontos como mandante por rodada',
      value: athlete.home.average.toFixed(1),
      canRender: () => !isCoach(athlete.posicao_id)
    },
    {
      label: 'MPV/R',
      title: 'Média de pontos como visitante por rodada',
      value: athlete.away.average.toFixed(1),
      canRender: () => !isCoach(athlete.posicao_id)
    },
    {
      label: "Vitórias %",
      title: "Percentual de vitórias",
      value: (athlete.victoriesAverage * 100).toFixed(1),
      canRender: () => isCoach(athlete.posicao_id)
    },
    {
      label: 'RV',
      title: 'Rodadas que valorizou',
      value: athlete.valuation.rounds.aboveZero,
      canRender: () => true
    },
    {
      label: 'RD',
      title: 'Rodadas que desvalorizou',
      value: athlete.valuation.rounds.belowZero,
      canRender: () => true
    },
  ]
}