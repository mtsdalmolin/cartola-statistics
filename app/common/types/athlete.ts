import { PositionsIds } from "@/app/constants/positions"
import { FootballTeamsIds } from "@/app/constants/teams"

export interface Athlete {
  atleta_id: number
  apelido: string
  foto: string
  media_num: number
  pontos_num: number
  jogos_num: number
  clube_id: FootballTeamsIds
  posicao_id: PositionsIds
  variacao_num: number
  scout: {
    A?: number  // Assistências
    CA?: number // Cartões amarelos
    CV?: number // Cartões vermelhos
    DE?: number // Defesas
    DS?: number // Desarmes
    FC?: number // Faltas cometidas
    FD?: number // Finalizações defendidas
    FF?: number // Finalizações pra fora
    FS?: number // Faltas sofridas
    FT?: number // Finalizações na trave
    G?: number  // Gols
    GS?: number // Gols sofridos
    I?: number  // Impedimentos
    PP?: number // Pênalti perdido
    PS?: number // Pênalti sofrido
    SG?: number // Sem sofrer gols
    V?: number  // Vitória
  }
  gato_mestre: {
    minutos_jogados: number
    media_pontos_mandante?: number
    media_pontos_visitante?: number
  }
}

export interface RenderedAthlete extends Omit<Athlete, 'pontos_num'> {
  castTimes: number
  captainTimes: number
  sumOfPoints: number
  overallAverage: number
  sumOfOverallAverage: number
  pointsAverage: number
  sumOfPlayedMinutes: number
  averageMinutesPerRound: number
  valuation: {
    rounds: {
      values: number[]
      aboveZero: number
      belowZero: number
      zero: number
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
  finishes: number
  finishesToScore: number
  goals: number
  defenses: number
  goalsAgainst: number
  defensesToSufferGoal: number
  minutesToScore: number
  highestPoint: number
  victoriesAverage: number
}

export type CrewStatistics = Record<string, RenderedAthlete>