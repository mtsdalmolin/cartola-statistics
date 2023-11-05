import bagreBadge from '@/public/badges/bagre-badge.svg'
import cameFromBenchAndMadeTwelvePointsBadge from '@/public/badges/came-from-bench-and-made-twelve-points-badge.svg'
import defenseDidntSufferGoalsBadge from '@/public/badges/defense-didnt-suffer-goals-badge.svg'
import everyAthleteValuedBadge from '@/public/badges/every-athlete-valued-badge.svg'
import everyMidfielderHaveAssistsBadge from '@/public/badges/every-midfielder-have-assists-badge.svg'
import everyStrikerScoredBadge from '@/public/badges/every-striker-scored-badge.svg'
import fourPlayersMadeLessThanZeroPointsBadge from '@/public/badges/four-players-made-less-than-zero-points-badge.svg'
import futebolaoLeaguePlayerBadge from '@/public/badges/futebolao-league-badge.svg'
import goalsInThreeSectionsBadge from '@/public/badges/goals-in-three-sections-badge.svg'
import hattrickBadge from '@/public/badges/hat-trick-badge.svg'
import moreThanHundredFiftyPointsInRoundBadge from '@/public/badges/more-than-hundred-fifty-points-in-round-badge.svg'
import moreThanHundredPointsInRoundBadge from '@/public/badges/more-than-hundred-points-in-round-badge.svg'
import moreThanThirtyPointsWithOnePlayerBadge from '@/public/badges/more-than-thirty-points-with-one-player-badge.svg'
import reached200CartoletasBadge from '@/public/badges/reached-200-cartoletas-badge.svg'
import sevenPlayersScoredInRoundBadge from '@/public/badges/seven-players-scored-in-round-badge.svg'
import threePlayersMissedPenaltyBadge from '@/public/badges/three-players-missed-penalty-badge.svg'
import threePlayersRedCardedBadge from '@/public/badges/three-players-red-carded-badge.svg'

import { Trophies } from '../common/types/trophies'

export const TROPHIES_IMAGE = {
  [Trophies.CAME_FROM_BENCH_AND_MADE_12_POINTS]: cameFromBenchAndMadeTwelvePointsBadge,
  [Trophies.DEFENSE_DIDNT_SUFFER_GOALS]: defenseDidntSufferGoalsBadge,
  [Trophies.EVERY_ATHLETE_VALUED]: everyAthleteValuedBadge,
  [Trophies.EVERY_MIDFIELDER_HAVE_ASSISTS]: everyMidfielderHaveAssistsBadge,
  [Trophies.EVERY_STRIKER_SCORED]: everyStrikerScoredBadge,
  [Trophies.FOUR_OR_MORE_PLAYERS_MADE_LESS_THAN_0_POINTS]: fourPlayersMadeLessThanZeroPointsBadge,
  [Trophies.FUTEBOLAO_LEAGUE_PLAYER]: futebolaoLeaguePlayerBadge,
  [Trophies.GOALS_IN_THREE_SECTIONS]: goalsInThreeSectionsBadge,
  [Trophies.LESS_THAN_30_POINTS_IN_ROUND]: bagreBadge,
  [Trophies.MORE_THAN_100_POINTS_IN_ROUND]: moreThanHundredPointsInRoundBadge,
  [Trophies.MORE_THAN_150_POINTS_IN_ROUND]: moreThanHundredFiftyPointsInRoundBadge,
  [Trophies.MORE_THAN_30_POINTS_WITH_PLAYER_IN_ROUND]: moreThanThirtyPointsWithOnePlayerBadge,
  [Trophies.MORE_THAN_THREE_RED_CARDED_PLAYERS]: threePlayersRedCardedBadge,
  [Trophies.PLAYER_SCORED_HATTRICK]: hattrickBadge,
  [Trophies.REACHED_200_CARTOLETAS]: reached200CartoletasBadge,
  [Trophies.SEVEN_PLAYERS_SCORED]: sevenPlayersScoredInRoundBadge,
  [Trophies.THREE_PLAYERS_MISSED_PENALTY]: threePlayersMissedPenaltyBadge
}

export const TROPHY_TO_PARAM: Record<Trophies, keyof typeof PARAM_TO_TROPHY> = {
  [Trophies.LESS_THAN_30_POINTS_IN_ROUND]: 'cabeca-de-bagre',
  [Trophies.CAME_FROM_BENCH_AND_MADE_12_POINTS]: 'veio-do-banco-e-mitou',
  [Trophies.DEFENSE_DIDNT_SUFFER_GOALS]: 'muralha',
  [Trophies.GOALS_IN_THREE_SECTIONS]: 'gols-nos-3-setores',
  [Trophies.EVERY_ATHLETE_VALUED]: 'todos-jogadores-valorizaram',
  [Trophies.EVERY_MIDFIELDER_HAVE_ASSISTS]: 'todos-meias-deram-assistencias',
  [Trophies.EVERY_STRIKER_SCORED]: 'todos-atacantes-marcaram',
  [Trophies.FOUR_OR_MORE_PLAYERS_MADE_LESS_THAN_0_POINTS]: '4-jogadores-pontuaram-negativo',
  [Trophies.FUTEBOLAO_LEAGUE_PLAYER]: 'liga-futebolao',
  [Trophies.PLAYER_SCORED_HATTRICK]: 'hat-trick',
  [Trophies.MORE_THAN_150_POINTS_IN_ROUND]: '150-pontos',
  [Trophies.MORE_THAN_100_POINTS_IN_ROUND]: '100-pontos',
  [Trophies.MORE_THAN_30_POINTS_WITH_PLAYER_IN_ROUND]: '30-pontos-com-um-jogador',
  [Trophies.REACHED_200_CARTOLETAS]: 'atingiu-200-cartoletas',
  [Trophies.SEVEN_PLAYERS_SCORED]: '7-jogadores-marcaram',
  [Trophies.THREE_PLAYERS_MISSED_PENALTY]: '3-jogadores-erraram-penaltis',
  [Trophies.MORE_THAN_THREE_RED_CARDED_PLAYERS]: '3-jogadores-expulsos'
}

export const PARAM_TO_TROPHY = {
  'cabeca-de-bagre': Trophies.LESS_THAN_30_POINTS_IN_ROUND,
  'veio-do-banco-e-mitou': Trophies.CAME_FROM_BENCH_AND_MADE_12_POINTS,
  'muralha': Trophies.DEFENSE_DIDNT_SUFFER_GOALS,
  'gols-nos-3-setores': Trophies.GOALS_IN_THREE_SECTIONS,
  'todos-jogadores-valorizaram': Trophies.EVERY_ATHLETE_VALUED,
  'todos-meias-deram-assistencias': Trophies.EVERY_MIDFIELDER_HAVE_ASSISTS,
  'todos-atacantes-marcaram': Trophies.EVERY_STRIKER_SCORED,
  '4-jogadores-pontuaram-negativo': Trophies.FOUR_OR_MORE_PLAYERS_MADE_LESS_THAN_0_POINTS,
  'liga-futebolao': Trophies.FUTEBOLAO_LEAGUE_PLAYER,
  'hat-trick': Trophies.PLAYER_SCORED_HATTRICK,
  '150-pontos': Trophies.MORE_THAN_150_POINTS_IN_ROUND,
  '100-pontos': Trophies.MORE_THAN_100_POINTS_IN_ROUND,
  '30-pontos-com-um-jogador': Trophies.MORE_THAN_30_POINTS_WITH_PLAYER_IN_ROUND,
  'atingiu-200-cartoletas': Trophies.REACHED_200_CARTOLETAS,
  '7-jogadores-marcaram': Trophies.SEVEN_PLAYERS_SCORED,
  '3-jogadores-erraram-penaltis': Trophies.THREE_PLAYERS_MISSED_PENALTY,
  '3-jogadores-expulsos': Trophies.MORE_THAN_THREE_RED_CARDED_PLAYERS
}

export const TROPHY_NAME = {
  'cabeca-de-bagre': 'Cabeça de Bagre',
  'veio-do-banco-e-mitou': 'Veio do Banco e Mitou',
  'muralha': 'Muralha',
  'gols-nos-3-setores': 'Gols nos 3 Setores',
  'todos-jogadores-valorizaram': 'Todos Jogadores Valorizaram',
  'todos-meias-deram-assistencias': 'Meias Garçons',
  'todos-atacantes-marcaram': 'Goleadores',
  '4-jogadores-pontuaram-negativo': 'Fulano não é Técnico',
  'liga-futebolao': 'Futebolão',
  'hat-trick': 'Hat-Trick',
  '150-pontos': '150 Pontos em uma Rodada',
  '100-pontos': '100 Pontos em uma Rodada',
  '30-pontos-com-um-jogador': 'Uma Besta Enjaulada',
  'atingiu-200-cartoletas': 'Tio Patinhas',
  '7-jogadores-marcaram': 'Jackpot',
  '3-jogadores-erraram-penaltis': 'Perninhas',
  '3-jogadores-expulsos': 'Azarão'
}

export const TWITTER_TROPHY_MESSAGE = {
  'cabeca-de-bagre': 'fiz menos de 30 pontos em uma rodada.',
  'veio-do-banco-e-mitou':
    'um dos jogadores que estavam no banco do cartola entrou e fez mais de 12 anos.',
  'muralha': 'a defesa escalada em uma das rodadas do cartola não sofreu gols.',
  'gols-nos-3-setores': 'tive gols nos 3 setores em uma rodada do cartola.',
  'todos-jogadores-valorizaram': 'todos os jogadores escalados no cartola valorizaram.',
  'todos-meias-deram-assistencias': 'todos os meias escalados em uma rodada fizeram assistências.',
  'todos-atacantes-marcaram': 'todos os atacantes marcaram em uma rodada do cartola.',
  '4-jogadores-pontuaram-negativo':
    '4 jogadores pontuaram menos de 0 pontos em uma rodada do cartola.',
  'liga-futebolao': 'participei da liga Futebolão no cartola.',
  'hat-trick': 'um jogador escalado fez um hat-trick.',
  '150-pontos': 'fiz mais de 150 pontos em uma rodada no cartola.',
  '100-pontos': 'fiz mais de 100 pontos em uma rodada no cartola.',
  '30-pontos-com-um-jogador': 'um dos jogadores que escalei fez mais de 30 pontos em uma rodada.',
  'atingiu-200-cartoletas': 'cheguei a 200 cartoletas.',
  '7-jogadores-marcaram': '7 jogadores que escalei marcaram em uma rodada no cartola.',
  '3-jogadores-erraram-penaltis': '3 jogadores que escalei erraram pênaltis.',
  '3-jogadores-expulsos': 'tive 3 jogadores expulsos nas escalações do cartola.'
}
