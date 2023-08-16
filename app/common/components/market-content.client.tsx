"use client"

import { AthleteTable } from "./athlete/athlete-table.client"
import { MarketStatistics } from "@/app/mercado/page"

export function MarketContent({ athletes }: { athletes: MarketStatistics }) {
  return <AthleteTable athletes={athletes} type="market" />
}