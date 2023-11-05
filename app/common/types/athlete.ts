import { PositionsIds } from '@/app/constants/positions'
import { StatusIds } from '@/app/constants/status'
import { FootballTeamsIds } from '@/app/constants/teams'

export interface Athlete {
  atleta_id: number
  apelido: string
  foto?: string
  media_num: number
  pontos_num: number
  jogos_num: number
  rodada_id: number
  clube_id: FootballTeamsIds
  posicao_id: PositionsIds
  variacao_num: number
  minimo_para_valorizar: number
  preco_num: number
  status_id?: StatusIds
  scout: {
    A?: number // Assistências
    CA?: number // Cartões amarelos
    CV?: number // Cartões vermelhos
    DE?: number // Defesas
    DS?: number // Desarmes
    FC?: number // Faltas cometidas
    FD?: number // Finalizações defendidas
    FF?: number // Finalizações pra fora
    FS?: number // Faltas sofridas
    FT?: number // Finalizações na trave
    G?: number // Gols
    GS?: number // Gols sofridos
    I?: number // Impedimentos
    PP?: number // Pênalti perdido
    PS?: number // Pênalti sofrido
    SG?: number // Sem sofrer gols
    V?: number // Vitória
  }
  gato_mestre: {
    minutos_jogados: number
    media_minutos_jogados?: number
    media_pontos_mandante?: number
    media_pontos_visitante?: number
  }
}

export interface RenderedAthlete extends Omit<Athlete, 'pontos_num'> {
  castTimes: number
  castRounds: number[]
  captainTimes: number
  captainRounds: { round: number; points: number; rawPoints: number }[]
  sumOfPoints: number
  overallAverage: number
  sumOfOverallAverage: number
  pointsAverage: number
  sumOfPlayedMinutes: number
  averageMinutesPerRound: number
  valuation: {
    rounds: {
      values: [number, number][]
      aboveZero: number
      belowZero: number
      zero: number
      sum: number
    }
  }
  home: {
    sumOfPoints: number
    average: number
  }
  away: {
    sumOfPoints: number
    average: number
  }
  cardsRounds: {
    yellow: { [key: string]: number }
    red: { [key: string]: number }
  }
  assists: number
  assistsRounds: { [key: string]: number }
  finishes: number
  finishesToScore: number
  goals: number
  scoredGoalsRounds: { [key: string]: number }
  defenses: number
  defensesRounds: { [key: string]: number }
  fouls: number
  foulsRounds: { [key: string]: number }
  goalsConceded: number
  goalsConcededRoundIds: number[]
  defensesToSufferGoal: number
  minutesToScore: number
  highestPoint: number
  highestPointScout: Athlete['scout']
  highestPointsRound: number
  offsideRounds: { [key: string]: number }
  participationInGoals: number
  participationInGoalsRounds: { [key: string]: number }
  pointsPerRound: { [key: string]: number }
  tacklesRounds: { [key: string]: number }
  victoriesAverage: number
  victoriesRoundIds: number[]
}

export type CrewStatistics = Record<string, RenderedAthlete>
export type ClubStatistics = Record<
  string,
  {
    id: FootballTeamsIds
    points: number
    pointsPercentage: number
    lineupNumbers: number
    positions: Record<string, number>
    positionsPoints: Record<string, number>
  }
>
