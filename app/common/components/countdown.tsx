'use client'

import Countdown from 'react-countdown'

import { useClient } from '@/app/helpers/hooks/use-client'

export function CountdownRoundClock({ date }: { date: string }) {
  const isClient = useClient()

  return isClient ? <Countdown date={new Date(date)} daysInHours /> : null
}
