export interface Match {
  home: {
    clubBadgeUrl: string
    name: string
  }
  away: {
    clubBadgeUrl: string
    name: string
  }
  result: {
    home?: number
    away?: number
    winner?: string | number
  }
}
