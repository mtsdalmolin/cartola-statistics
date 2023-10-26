export interface TeamInfo {
  badgePhotoUrl: string
  name: string
  pointsPerTurn: {
    first: {
      average: number
      total: number
    }
    second: {
      average: number
      total: number
    }
  }
}
