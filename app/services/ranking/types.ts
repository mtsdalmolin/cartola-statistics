import { RoundData } from '../types'

export interface TotalPointsRankingData {
  team_id: number
  team_name: string
  team_badge: string
  year: number
  points: number
}

export interface BestLineupsRankingData {
  team_id: number
  team_name: string
  team_badge: string
  payload: RoundData
  points: number
}

export interface WealthRankingData {
  team_id: number
  team_name: string
  team_badge: string
  payload: RoundData
  wealth: number
}
