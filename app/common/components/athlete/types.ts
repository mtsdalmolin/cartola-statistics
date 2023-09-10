export interface AthleteTableData {
  id: number
  photoUrl: string
  name: string
  club: string
  clubBadgeUrl: string
  position: string
  highestPoint: number
  sumOfPlayedMinutes: number
  averageMinutesPerRound: number
  pointsAverage: number
  pointsAverageHome: number
  pointsAverageAway: number
  finishes: number
  finishesToScore: number
  goals: number
  defenses: number
  goalsAgainst: number
  defensesToSufferGoal: number
  minutesToScore: number
  victoriesAverage: number
  castTimes: number
  captainTimes: number
  match: never
}

export type AthleteTableDataWithoutMatchKey = Omit<AthleteTableData, 'match'>
