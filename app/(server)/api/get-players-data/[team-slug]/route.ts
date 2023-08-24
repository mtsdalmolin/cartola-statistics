import { NextResponse } from 'next/server'
import isNil from 'lodash/isNil'
import isEmpty from 'lodash/isEmpty'
import isArray from 'lodash/isArray'
import { request as makeRequest } from '@/app/services/cartola-api'
import { createClient } from '@supabase/supabase-js'
import { TEAMS } from '@/app/constants/data'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

const supabase = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } })

const TEAM_ROUND_ENDPOINT = (teamId: string, round: string) => `time/id/${teamId}/${round}`

type GetContext = {
  params: {
    [key: string]: string
  },
  searchParams: {
    [key: string]: string | string[]
  }
}

const TABLE_NAME = 'cartola-request-cache'

export async function GET(request: Request, context: GetContext) {
  const teamData = TEAMS.find(team => team.slug === context.params['team-slug'])
  const { searchParams } = new URL(request.url)
  const round = searchParams.get('round')

  if (isArray(round) || isNil(round)) {
    return NextResponse.json({ message: 'Bad format' }, { status: 422 })
  }

  if (isNil(teamData)) {
    return NextResponse.json({ message: 'Team not found' }, { status: 404 })
  }

  const cartolaEndpoint = TEAM_ROUND_ENDPOINT(teamData.id.toString(), round)

  const cachedResponse = await supabase
    .from(TABLE_NAME)
    .select('payload')
    .like('endpoint', `%${cartolaEndpoint}`)

  let result;
  let needsToFetchFromCartola = true

  if (!isNil(cachedResponse.data) && !isEmpty(cachedResponse.data)) {
    result = cachedResponse.data[0].payload
    needsToFetchFromCartola = false
    console.log('got data from supabase cache')
  }

  if (needsToFetchFromCartola) {
    result = await makeRequest(cartolaEndpoint)

    console.log('fetching data from cartola api: ', cartolaEndpoint)

    const today = new Date()
    await supabase
      .from(TABLE_NAME)
      .insert([{
        payload: result,
        endpoint: `${today.getFullYear()}/${cartolaEndpoint}`
      }])
      .select()
  }

  return NextResponse.json(result, { status: 200 })
}