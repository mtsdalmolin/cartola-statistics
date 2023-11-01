type TurnData = {
  average: number
  total: number
  validRounds: number
}

export interface TeamInfo {
  id: number
  badgePhotoUrl: string
  name: string
  pointsPerTurn: {
    first: TurnData
    second: TurnData
  }
}
