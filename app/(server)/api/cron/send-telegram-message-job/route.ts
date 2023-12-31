import { NextResponse } from 'next/server'

import { Athlete } from '@/app/common/types/athlete'
import { StatusIds, PROSPECTIVE, NULL } from '@/app/constants/status'
import { FOOTBALL_TEAMS, FootballTeamsIds } from '@/app/constants/teams'
import { getPositionAbbreviation } from '@/app/helpers/positions'
import { getStatusName } from '@/app/helpers/status'
import { getFootballTeamName } from '@/app/helpers/teams'
import { request } from '@/app/services/cartola-api'
import { sql } from '@vercel/postgres'

import isEmpty from 'lodash/isEmpty'
import isNil from 'lodash/isNil'

interface AthleteMessageEntity {
  athleteId: number
  clubId: number
  positionId: number
  oldStatusId: number
  newStatusId: number
  nickname: string
}

export const dynamic = 'force-dynamic'

const ENDPOINTS = {
  MARKET: '/atletas/mercado',
  MATCHES: '/partidas'
}

const token = process.env.NEXT_API_TELEGRAM_TOKEN
const chatId = process.env.NEXT_API_TELEGRAM_CHAT_ID

async function sendMessageToTelegramGroup(message: string) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'MarkdownV2'
      })
    })
    return await response.json()
  } catch (err: any) {
    console.error(err.response.message ?? 'something bad occurred')
    return err.response
  }
}

async function saveMarketDataToNeon({ payload, status }: { payload: string; status: string }) {
  return await sql`
    INSERT INTO market_status_requests (payload, status)
    VALUES (${payload}, ${status});
  `
}

async function getMarketDataFromCartolaApi() {
  const response = await request<{ atletas: Athlete[] }>(ENDPOINTS.MARKET, { cache: 'no-store' })

  return response.atletas
}

function escapeMarkdownSpecialCharacters(word: string) {
  return word.replace(/(\-|\.)/g, (match) => `\\${match}`)
}

function clusterAthletesPerClub(changedAthletes: AthleteMessageEntity[]) {
  let message = ''
  let athleteIndex = 1

  Object.keys(FOOTBALL_TEAMS).forEach((teamId) => {
    const teamChangedAthletes = changedAthletes.filter(
      (athlete) => athlete.clubId.toString() === teamId
    )

    if (!isEmpty(teamChangedAthletes)) {
      message += `*${escapeMarkdownSpecialCharacters(
        getFootballTeamName(teamId as unknown as FootballTeamsIds)
      )}*\n`

      teamChangedAthletes.forEach((athlete) => {
        message += `  ${athleteIndex.toString()}\\. _${escapeMarkdownSpecialCharacters(
          athlete.nickname
        )}_ \\(${getPositionAbbreviation(
          athlete.positionId
        ).toUpperCase()}\\) mudou de *${getStatusName(
          athlete.oldStatusId as StatusIds
        )}* para *${getStatusName(athlete.newStatusId as StatusIds)}*\n`
        athleteIndex++
      })
    }

    athleteIndex = 1
  })

  return message
}

async function saveSuccess<T>(marketData: T) {
  return await saveMarketDataToNeon({
    payload: JSON.stringify(marketData),
    status: 'success'
  })
}

async function saveError<T>(error: T) {
  return await saveMarketDataToNeon({
    payload: JSON.stringify(error),
    status: 'error'
  })
}

function athleteMessageEntityFactory(athlete: Athlete, oldAthlete: Athlete): AthleteMessageEntity {
  return {
    athleteId: athlete.atleta_id,
    clubId: athlete.clube_id,
    positionId: athlete.posicao_id,
    oldStatusId: oldAthlete.status_id ?? NULL,
    newStatusId: athlete.status_id ?? NULL,
    nickname: athlete.apelido
  }
}

function isInProspectiveStatus(athlete: Athlete) {
  return PROSPECTIVE === athlete.status_id
}

function isInProspectiveStatusAndDifference(oldAthlete: Athlete, athlete: Athlete) {
  return (
    (isInProspectiveStatus(oldAthlete) || isInProspectiveStatus(athlete)) &&
    oldAthlete.status_id !== athlete.status_id
  )
}

export async function GET() {
  try {
    const marketData = await getMarketDataFromCartolaApi()

    if (!marketData) throw new Error("Couldn't load data from cartola api")

    const neonMarketData = await sql`
      SELECT payload
      FROM market_status_requests
      WHERE status = 'success'
      ORDER BY created_at DESC
      FETCH FIRST 1 ROWS ONLY;
    `

    if (!(neonMarketData.rows.length > 0))
      return NextResponse.json(
        {
          ok: false,
          error: 'Could not load data from database'
        },
        {
          status: 400
        }
      )

    const changedAthletes: AthleteMessageEntity[] = []

    marketData.forEach((athlete) => {
      const oldAthlete: Athlete = neonMarketData.rows[0].payload.find(
        (oldAthlete: Athlete) => oldAthlete.atleta_id === athlete.atleta_id
      )

      if (!isNil(oldAthlete) && isInProspectiveStatusAndDifference(oldAthlete, athlete)) {
        changedAthletes.push(athleteMessageEntityFactory(athlete, oldAthlete))
      }
    })

    const telegramMessage = clusterAthletesPerClub(changedAthletes)

    if (isEmpty(telegramMessage)) return NextResponse.json({ ok: true, message: 'No differences' })

    const response: {
      ok: boolean
      description?: string
    } = await sendMessageToTelegramGroup(telegramMessage)

    if (response.ok) {
      await saveSuccess(marketData)
    } else {
      return NextResponse.json(
        {
          ok: false,
          error: new Error(response.description ?? "Couldn't send message to Telegram")
        },
        {
          status: 400
        }
      )
    }

    return NextResponse.json({ ok: true, message: telegramMessage })
  } catch (err: any) {
    saveError({
      payload: {
        message: err?.response?.description ?? err?.response?.message ?? err.message,
        data: err?.response?.data ?? err
      },
      status: 'error'
    })

    return NextResponse.json({ ok: false, error: err }, { status: 400 })
  }
}
