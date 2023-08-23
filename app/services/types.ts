import { Athlete } from "../common/types/athlete"

export interface RoundData {
  atletas: Athlete[]
  reservas?: Athlete[]
  rodada_atual: number
  capitao_id: number
  pontos_campeonato: number
}