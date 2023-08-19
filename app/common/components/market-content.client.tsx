"use client"

import { useEffect, useState } from "react"
import { AthleteTable } from "./athlete/athlete-table.client"
import { MarketStatistics } from "@/app/mercado/page"

export function MarketContent({ athletes }: { athletes: MarketStatistics }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    if (window !== undefined) {
      setIsClient(true)
    }
  }, [])

  return isClient ? (
    <AthleteTable athletes={athletes} type="market" isEditable />
  ) : null
}