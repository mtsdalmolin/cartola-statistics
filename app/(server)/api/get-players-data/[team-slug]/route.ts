import { NextResponse } from 'next/server'
import isNil from 'lodash/isNil'
import isEmpty from 'lodash/isEmpty'
import isArray from 'lodash/isArray'
import { request as makeRequest } from '@/app/services/cartola-api'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } })

const TEAM_ROUND_ENDPOINT = (teamId: string, round: string) => `time/id/${teamId}/${round}`

export const ROUNDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
const MIOLLO_AND_THOMAS_ROUNDS = [18, 19]

export const TEAMS = [
  {
    id: 25929996,
    slug: 'sociedade-esportiva-tacu',
    name: 'Sociedade Esportiva Tacu',
    rounds: ROUNDS
  },
  {
    id: 29367702,
    slug: '4-de-maio-futebol-e-cerveja',
    name: '4 de maio futebol e cerveja',
    rounds: ROUNDS
  },
  {
    id: 15159981,
    slug: 'valeimoveis',
    name: 'Valeimoveis',
    rounds: ROUNDS
  },
  {
    id: 112714,
    slug: 'real-egrete',
    name: 'Real Egrete',
    rounds: ROUNDS
  },
  {
    id: 47843698,
    slug: 'quarai-querencia-querida-fc',
    name: 'Quaraí Querência Querida FC',
    rounds: ROUNDS
  },
  {
    id: 28738386,
    slug: 'padariasilvalvto',
    name: 'Padariasilvalvto',
    rounds: ROUNDS
  },
  {
    id: 48903399,
    slug: 'os-sem-pernas-pcd',
    name: 'Os Sem Pernas PCD',
    rounds: MIOLLO_AND_THOMAS_ROUNDS
  },
  {
    id: 48902734,
    slug: 'miollo-futebol-e-tristeza',
    name: 'Miollo Futebol e Tristeza',
    rounds: MIOLLO_AND_THOMAS_ROUNDS
  },
]

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
    result = await makeRequest(cartolaEndpoint).then(res => res.json())

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