'use client'

import Countdown, { CountdownRendererFn } from 'react-countdown'

import { useClient } from '@/app/helpers/hooks/use-client'

import { formatDistanceToNow, intervalToDuration } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'
import { ptBR } from 'date-fns/locale'

const SP_TIMEZONE_STRING = 'America/Sao_Paulo'

const addZeroInFrontOfTimeNumber = (timeNumber: number) => {
  if (timeNumber < 10) {
    return `0${timeNumber}`
  }

  return timeNumber
}

export function RoundStartInfo({ dateStr, roundName }: { dateStr: string; roundName: string }) {
  const datetimeThatClosesMarket = zonedTimeToUtc(new Date(dateStr), SP_TIMEZONE_STRING)
  const today = zonedTimeToUtc(new Date(), SP_TIMEZONE_STRING)
  const distance = intervalToDuration({
    start: datetimeThatClosesMarket,
    end: today
  })

  const dateDistanceText = formatDistanceToNow(datetimeThatClosesMarket, { locale: ptBR })

  const isClient = useClient()

  if (!isClient) {
    return null
  }

  if (distance.days === 0) {
    const renderer: CountdownRendererFn = ({ hours, minutes, seconds, completed }) => {
      if (completed) {
        return <div className="text-center">{roundName} começou!</div>
      } else {
        return (
          <div className="text-center">
            {`${roundName} começa em ${addZeroInFrontOfTimeNumber(
              hours
            )}:${addZeroInFrontOfTimeNumber(minutes)}:${addZeroInFrontOfTimeNumber(seconds)}`}
          </div>
        )
      }
    }

    return <Countdown date={datetimeThatClosesMarket} renderer={renderer} daysInHours />
  }

  return <div className="text-center">{`${roundName} começa em ${dateDistanceText}`}</div>
}
