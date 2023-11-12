import { Athlete } from '../common/types/athlete'
import { Match } from '../common/types/match'

export interface RoundData {
  atletas: Athlete[]
  reservas?: Athlete[]
  rodada_atual: number
  capitao_id: number
  patrimonio: number
  pontos: number
  pontos_campeonato: number
  time: {
    url_escudo_svg: string
    url_escudo_png: string
    nome: string
    time_id: number
  }
}
export interface MatchFromApi {
  clube_visitante_id: number
  clube_casa_id: number
  partida_data: Date
  placar_oficial_visitante: number
  placar_oficial_mandante: number
}

export interface MatchesData {
  partidas: MatchFromApi[]
  rodada: number
}

export interface RoundMatchesData {
  [roundId: string]: { [clubId: string]: Match }
}

export interface SubsData {
  entrou: Athlete
  saiu: Athlete
}

export interface TeamFromSearchApi {
  time_id: number
  nome: string
  nome_cartola: string
  url_escudo_png: string
}
