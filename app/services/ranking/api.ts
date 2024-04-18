import { BestLineupsRankingData, TotalPointsRankingData } from './types'

export async function getTotalPointsRankingData(year: number, isClient = true) {
  const rankingData = await fetch(
    `${isClient ? '' : process.env.NEXT_API_BASE_URL}/api/ranking/get-total-points?year=${year}`
  ).then((res) => res.json())

  return rankingData as TotalPointsRankingData[]
}

export async function getBestLineupsRankingData(year: number, isClient = true) {
  const rankingData = await fetch(
    `${isClient ? '' : process.env.NEXT_API_BASE_URL}/api/ranking/get-best-lineup?year=${year}`
  ).then((res) => res.json())

  return rankingData as BestLineupsRankingData[]
}
