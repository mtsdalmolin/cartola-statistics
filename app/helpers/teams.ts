import { FOOTBALL_TEAMS, type FootballTeamsIds } from '../constants/teams'

enum BADGE_SIZES {
  'sm' = '30x30',
  'md' = '45x45',
  'lg' = '60x60'
}

export function getFootballTeamBadgeLink(
  footballTeamId: FootballTeamsIds,
  size: keyof typeof BADGE_SIZES = 'sm'
) {
  return FOOTBALL_TEAMS[footballTeamId].escudos[BADGE_SIZES[size]]
}

export function getFootballTeamName(footballTeamId: FootballTeamsIds) {
  return FOOTBALL_TEAMS[footballTeamId].nome
}

export function getFootballTeamAbbreviation(footballTeamId: FootballTeamsIds) {
  return FOOTBALL_TEAMS[footballTeamId].abreviacao
}
