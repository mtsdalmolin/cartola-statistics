import { PositionsIds } from '@/app/constants/positions'

export type PositionOption = {
  value: string
  label: string
}

export type PositionsStatistics = Record<
  string,
  { id: PositionsIds; points: number; pointsPercentage: number }
>
