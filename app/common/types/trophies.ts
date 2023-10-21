import { RoundData } from '@/app/services/types'

import { Athlete } from './athlete'

export enum Trophies {
  PLAYER_SCORED_HATTRICK = 'player-scored-hattrick',
  MORE_THAN_100_POINTS_IN_ROUND = 'more-than-100-points-in-round',
  MORE_THAN_150_POINTS_IN_ROUND = 'more-than-150-points-in-round',
  LESS_THAN_30_POINTS_IN_ROUND = 'less-than-30-points-in-round',
  MORE_THAN_30_POINTS_WITH_PLAYER_IN_ROUND = 'more-than-30-points-with-player-in-round',
  SEVEN_PLAYERS_SCORED = 'seven-players-scored',
  MORE_THAN_THREE_RED_CARDED_PLAYERS = 'more-than-three-red-carded-players',
  THREE_PLAYERS_MISSED_PENALTY = 'three-players-missed-penalty',
  FUTEBOLAO_LEAGUE_PLAYER = 'futebolao-league-player'
  // jogador que mais pontuou na rodada
  // entrou do banco e fez mais que 10 pontos
}

export type TrophiesData = { [key in Trophies]?: Athlete[] | RoundData }
