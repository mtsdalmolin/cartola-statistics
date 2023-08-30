export const STATISTICS_IDS = {
  highestPoints: 'highest-points',
  minutesPlayed: 'minutes-played',
  goals: 'goals',
  minutesToScore: 'minutes-to-score',
  finishes: 'finishes',
  finishesToScore: 'finishes-to-score',
  defenses: 'defenses',
  goalsAgainst: 'goals-against',
  defensesToSufferGoal: 'defenses-to-suffer-goal',
  averagePointsHome: 'average-points-home',
  averagePointsAway: 'average-points-away',
  victoriesPercentage: 'victories-percentage',
  roundsValuated: 'rounds-valuated',
  roundsDevaluated: 'rounds-devaluated',
}

export const CAST_TIMES_OPTION = { value: 'castTimes', label: 'Escalações' }
export const CAPTAIN_TIMES_OPTION = { value: 'captainTimes', label: 'Vezes capitão' }
export const POINTS_AVERAGE_OPTION = { value: 'pointsAverage', label: 'Média' }
export const OVERALL_AVERAGE_OPTION = { value: 'overallAverage', label: 'Média Geral' }
export const HIGHEST_POINTS_OPTION = { value: 'highestPoint', label: 'Maior pontuação' }
export const MINUTES_PLAYES_OPTION = { value: 'sumOfPlayedMinutes', label: 'Minutos jogados' }
export const GOALS_OPTION = { value: 'goals', label: 'Gols' }
export const MINUTES_TO_SCORE_OPTION = { value: 'minutesToScore', label: 'Minutos para Gol' }
export const FINISHES_OPTION = { value: 'finishes', label: 'Finalizações' }
export const FINISHES_TO_SCORE_OPTION = { value: 'finishesToScore', label: 'Finalizações para gol' }
export const AVERAGE_POINTS_HOME_OPTIONS = { value: 'home.average', label: 'Média de pontos mandante' }
export const AVERAGE_POINTS_AWAY_OPTIONS = { value: 'away.average', label: 'Média de pontos visitante' }
export const DEFENSES_OPTION = { value: 'defenses', label: 'Defesas' }
export const DEFENSES_TO_SUFFER_GOAL_OPTION = { value: 'defensesToSufferGoal', label: 'Defesas para sofrer gol (DPG)' }
export const VICTORIES_PERCENTAGE_OPTION = { value: 'victoriesAverage', label: 'Vitórias %' }
export const ROUNDS_THAT_VALUATED_OPTION = { value: 'valuation.rounds.aboveZero', label: 'Rodadas que valorizou' }
export const ROUNDS_THAT_DEVALUATED_OPTION = { value: 'valuation.rounds.belowZero', label: 'Rodadas que desvalorizou' }

export const OPTIONS = {
  [STATISTICS_IDS.highestPoints]: HIGHEST_POINTS_OPTION,
  [STATISTICS_IDS.minutesPlayed]: MINUTES_PLAYES_OPTION,
  [STATISTICS_IDS.goals]: GOALS_OPTION,
  [STATISTICS_IDS.minutesToScore]: MINUTES_TO_SCORE_OPTION,
  [STATISTICS_IDS.finishes]: FINISHES_OPTION,
  [STATISTICS_IDS.finishesToScore]: FINISHES_TO_SCORE_OPTION,
  [STATISTICS_IDS.averagePointsHome]: AVERAGE_POINTS_HOME_OPTIONS,
  [STATISTICS_IDS.averagePointsAway]: AVERAGE_POINTS_AWAY_OPTIONS,
  [STATISTICS_IDS.defenses]: DEFENSES_OPTION,
  [STATISTICS_IDS.defensesToSufferGoal]: DEFENSES_TO_SUFFER_GOAL_OPTION,
  [STATISTICS_IDS.victoriesPercentage]: VICTORIES_PERCENTAGE_OPTION,
  [STATISTICS_IDS.roundsValuated]: ROUNDS_THAT_VALUATED_OPTION,
  [STATISTICS_IDS.roundsDevaluated]: ROUNDS_THAT_DEVALUATED_OPTION,
}

export type StatisticOption = typeof CAST_TIMES_OPTION
