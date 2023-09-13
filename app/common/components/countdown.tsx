'use client'

import Countdown from 'react-countdown'

import { useClient } from '@/app/helpers/hooks/use-client'

export function CountdownRoundClock({ date }: { date: Date }) {
  const isClient = useClient()

  return isClient ? <Countdown date={date} daysInHours /> : null
}
