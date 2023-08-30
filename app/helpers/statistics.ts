import { RenderedAthlete } from "../common/types/athlete";
import { STATISTICS_IDS } from "../constants/statistics";
import { isCoach, isGoalkeeper } from "./positions";

export function getAthleteStatistics(athlete: RenderedAthlete) {
  return [
    {
      id: STATISTICS_IDS.highestPoints,
      label: 'Maior pont.',
      title: 'Maior pontuação',
      value: athlete.highestPoint,
      canRender: () => true,
    },
    {
      id: STATISTICS_IDS.minutesPlayed,
      label: 'Min. jogados',
      title: 'Minutos jogados',
      value: athlete.sumOfPlayedMinutes,
      canRender: () => !isCoach(athlete.posicao_id)
    },
    {
      id: STATISTICS_IDS.goals,
      label: 'Gols',
      title: 'Gols',
      value: athlete.goals,
      canRender: () => !isCoach(athlete.posicao_id) && (!isGoalkeeper(athlete.posicao_id) && athlete.goals > 0)
    },
    {
      id: STATISTICS_IDS.minutesToScore,
      label: 'MPG',
      title: 'Minutos para marcar gol',
      value: athlete.minutesToScore.toFixed(1),
      canRender: () => isFinite(athlete.minutesToScore)
    },
    {
      id: STATISTICS_IDS.finishes,
      label: "Finalizações",
      title: "Finalizações",
      value: athlete.finishes,
      canRender: () => !isGoalkeeper(athlete.posicao_id) && !isCoach(athlete.posicao_id)
    },
    {
      id: STATISTICS_IDS.finishesToScore,
      label: "FPG",
      title: "Finalizações para marcar gols",
      value: athlete.finishesToScore.toFixed(1),
      canRender: () => !isGoalkeeper(athlete.posicao_id) && !isCoach(athlete.posicao_id) && isFinite(athlete.finishesToScore)
    },
    {
      id: STATISTICS_IDS.defenses,
      label: 'Defesas',
      title: 'Defesas',
      value: athlete.defenses.toFixed(1),
      canRender: () => isGoalkeeper(athlete.posicao_id)
    },
    {
      id: STATISTICS_IDS.goalsAgainst,
      label: 'Gols sofridos',
      title: 'Gols sofridos',
      value: athlete.goalsAgainst.toFixed(1),
      canRender: () => isGoalkeeper(athlete.posicao_id)
    },
    {
      id: STATISTICS_IDS.defensesToSufferGoal,
      label: 'DPG',
      title: 'Defesas para sofrer gols',
      value: athlete.defensesToSufferGoal.toFixed(1),
      canRender: () => isGoalkeeper(athlete.posicao_id) && isFinite(athlete.defensesToSufferGoal)
    },
    {
      id: STATISTICS_IDS.averagePointsHome,
      label: 'MPM/R',
      title: 'Média de pontos como mandante por rodada',
      value: athlete.home.average.toFixed(1),
      canRender: () => !isCoach(athlete.posicao_id)
    },
    {
      id: STATISTICS_IDS.averagePointsAway,
      label: 'MPV/R',
      title: 'Média de pontos como visitante por rodada',
      value: athlete.away.average.toFixed(1),
      canRender: () => !isCoach(athlete.posicao_id)
    },
    {
      id: STATISTICS_IDS.victoriesPercentage,
      label: "Vitórias %",
      title: "Percentual de vitórias",
      value: (athlete.victoriesAverage * 100).toFixed(1),
      canRender: () => isCoach(athlete.posicao_id)
    },
    {
      id: STATISTICS_IDS.roundsValuated,
      label: 'RV',
      title: 'Rodadas que valorizou',
      value: athlete.valuation.rounds.aboveZero,
      canRender: () => true
    },
    {
      id: STATISTICS_IDS.roundsDevaluated,
      label: 'RD',
      title: 'Rodadas que desvalorizou',
      value: athlete.valuation.rounds.belowZero,
      canRender: () => true
    },
  ]
}