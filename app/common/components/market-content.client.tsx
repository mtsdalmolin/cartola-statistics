'use client'

import { useClient } from '@/app/helpers/hooks/use-client'
import { MarketStatistics } from '@/app/mercado/page'

import { AthleteTable } from './athlete/athlete-table.client'

export function MarketContent({ athletes }: { athletes: MarketStatistics }) {
  const isClient = useClient()

  return isClient ? <AthleteTable athletes={athletes} type="market" isEditable /> : null
}
