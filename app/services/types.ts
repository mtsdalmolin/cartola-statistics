import { Athlete } from '../common/types/athlete'
import { Match } from '../common/types/match'

export interface RoundData {
  atletas: Athlete[]
  reservas?: Athlete[]
  rodada_atual: number
  capitao_id: number
  pontos_campeonato: number
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
}

export interface RoundMatchesData {
  [roundId: string]: { [clubId: string]: Match }
}
