import { NextResponse } from 'next/server'
import isNil from 'lodash/isNil'
import isEmpty from 'lodash/isEmpty'
import { request } from '@/app/services/cartola-api'
import { supabaseClient } from '@/app/services/supabase'
import { getStatusName } from '@/app/helpers/status'
import { Athlete } from '@/app/common/types/athlete'
import { DOUBT, StatusIds } from '@/app/constants/status'
import { getFootballTeamName } from '@/app/helpers/teams'
import { FOOTBALL_TEAMS, FootballTeamsIds } from '@/app/constants/teams'
import { getPositionAbbreviation } from '@/app/helpers/positions'

interface AthleteMessageEntity {
  athleteId: number
  clubId: number
  positionId: number
  oldStatusId: number
  newStatusId: number
  nickname: string
}

const ENDPOINTS = {
  MARKET: '/atletas/mercado',
  MATCHES: '/partidas',
}

const token = process.env.NEXT_API_TELEGRAM_TOKEN
const chatId = process.env.NEXT_API_TELEGRAM_CHAT_ID

async function sendMessageToTelegramGroup(message: string) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
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

async function saveMarketDataToSupabase({ payload, status }: { payload: any, status: string }) {
  return await supabaseClient
    .from('market-status-requests')
    .insert([{ payload, status }])
    .select()
}

async function getMarketDataFromCartolaApi() {
  const response = await request(ENDPOINTS.MARKET)

  return response.atletas as Athlete[]
}

function clusterAthletesPerClub(changedAthletes: AthleteMessageEntity[]) {
  let message = ''
  let athleteIndex = 1

  Object.keys(FOOTBALL_TEAMS).forEach(teamId => {
    const teamChangedAthletes = changedAthletes.filter(athlete => athlete.clubId.toString() === teamId)
    
    if (!isEmpty(teamChangedAthletes)) {
      message += `*${getFootballTeamName(teamId as unknown as FootballTeamsIds)}*\n`

      teamChangedAthletes.forEach(athlete => {
        message += `  ${athleteIndex.toString()}\\. _${athlete.nickname}_ \\(${getPositionAbbreviation(athlete.positionId).toUpperCase()}\\) mudou de *${getStatusName(athlete.oldStatusId as StatusIds)}* para *${getStatusName(athlete.newStatusId as StatusIds)}*\n`
        athleteIndex++
      })
    }

    athleteIndex = 1
  })

  return message
}

function saveSuccess<T>(marketData: T) {
  saveMarketDataToSupabase({
    payload: marketData,
    status: 'success'
  })
}

function saveError<T>(error: T) {
  saveMarketDataToSupabase({
    payload: error,
    status: 'error'
  })
}

function athleteMessageEntityFactory(athlete: Athlete, oldAthlete: Athlete): AthleteMessageEntity {
  return {
    athleteId: athlete.atleta_id,
    clubId: athlete.clube_id,
    positionId: athlete.posicao_id,
    oldStatusId: oldAthlete.status_id ?? DOUBT,
    newStatusId: athlete.status_id ?? DOUBT,
    nickname: athlete.apelido
  }
}

export async function GET() {
  try {
    const marketData = await getMarketDataFromCartolaApi()
  
    if (!marketData)
      throw new Error('Couldn\'t load data from cartola api')
  
    const { data: supabaseMarketData } = await supabaseClient
      .from('market-status-requests')
      .select('payload')
      .order('created_at', { ascending: false })
  
    if (!supabaseMarketData?.[0].payload)
      throw new Error('Couldn\'t load data from supabase')
  
    const changedAthletes: AthleteMessageEntity[] = []
  
    marketData.forEach(athlete => {
      const oldAthlete: Athlete = supabaseMarketData[0].payload.find((oldAthlete: Athlete) => oldAthlete.atleta_id === athlete.atleta_id)
  
      if (!isNil(oldAthlete) && oldAthlete.status_id !== athlete.status_id) {
        changedAthletes.push(athleteMessageEntityFactory(athlete, oldAthlete))
      }
    })
  
    const telegramMessage = clusterAthletesPerClub(changedAthletes)

    const response: {
      ok: boolean,
      description?: string
    } = await sendMessageToTelegramGroup(telegramMessage)
  
    if (response.ok) {
      saveSuccess(marketData)
    } else {
      throw new Error(response.description ?? 'Couldn\'t send message to Telegram')
    }
    
    return NextResponse.json({ ok: true, message: telegramMessage })
  } catch (err: any) {
    saveError({
      payload: {
        message: err?.response?.description ?? err?.response?.message ?? err.message,
        data: err?.response.data
      },
      status: 'error'
    })

    return NextResponse.json({ ok: false, error: err })
  }
}