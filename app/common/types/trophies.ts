import { RoundData } from '@/app/services/types'

import { Athlete } from './athlete'
import { Subs } from './subs'

export enum Trophies {
  CAME_FROM_BENCH_AND_MADE_12_POINTS = 'came-from-bench-and-made-12-points',
  DEFENSE_DIDNT_SUFFER_GOALS = 'defense-didnt-suffer-goals',
  EVERY_STRIKER_SCORED = 'every-striker-scored',
  EVERY_ATHLETE_VALUED = 'every-athlete-valued',
  EVERY_MIDFIELDER_HAVE_ASSISTS = 'every-midfielder-have-assists',
  FOUR_OR_MORE_PLAYERS_MADE_LESS_THAN_0_POINTS = 'four-or-more-players-made-less-than-0-points',
  FUTEBOLAO_LEAGUE_PLAYER = 'futebolao-league-player',
  GOALS_IN_THREE_SECTIONS = 'goals-in-three-sections',
  LESS_THAN_30_POINTS_IN_ROUND = 'less-than-30-points-in-round',
  MORE_THAN_100_POINTS_IN_ROUND = 'more-than-100-points-in-round',
  MORE_THAN_150_POINTS_IN_ROUND = 'more-than-150-points-in-round',
  MORE_THAN_30_POINTS_WITH_PLAYER_IN_ROUND = 'more-than-30-points-with-player-in-round',
  MORE_THAN_THREE_RED_CARDED_PLAYERS = 'more-than-three-red-carded-players',
  PLAYER_SCORED_HATTRICK = 'player-scored-hattrick',
  REACHED_200_CARTOLETAS = 'reached-200-cartoletas',
  SEVEN_PLAYERS_SCORED = 'seven-players-scored',
  THREE_PLAYERS_MISSED_PENALTY = 'three-players-missed-penalty'
  // jogador que mais pontuou na rodada
  // entrou do banco e fez mais que 10 pontos
}

export type TrophiesData = { [key in Trophies]?: Athlete[] | RoundData | Subs }
