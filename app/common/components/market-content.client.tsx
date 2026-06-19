'use client'

import { MarketStatistics } from '@/app/(default)/(user)/in/mercado/page'
import { useClient } from '@/app/helpers/hooks/use-client'

import { AthleteTable } from './athlete/athlete-table.client'

export function MarketContent({ athletes }: { athletes: MarketStatistics }) {
  const isClient = useClient()

  return isClient ? <AthleteTable athletes={athletes} type="market" isEditable /> : null
}
