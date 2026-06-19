import {
  FOOTBALL_TEAMS,
  NATIONAL_TEAMS,
  type FootballTeamsIds,
  FootballNationalTeamsIds
} from '../constants/teams'

enum BADGE_SIZES {
  'sm' = '30x30',
  'md' = '45x45',
  'lg' = '60x60'
}

function isNationalTeamId(
  footballTeamId: FootballTeamsIds | FootballNationalTeamsIds
): footballTeamId is FootballNationalTeamsIds {
  return Object.prototype.hasOwnProperty.call(NATIONAL_TEAMS, String(footballTeamId))
}

export function getFootballTeamBadgeLink(
  footballTeamId: FootballTeamsIds | FootballNationalTeamsIds,
  size: keyof typeof BADGE_SIZES = 'sm'
) {
  if (isNationalTeamId(footballTeamId))
    return NATIONAL_TEAMS[footballTeamId].escudos[BADGE_SIZES[size]]
  return FOOTBALL_TEAMS[footballTeamId].escudos[BADGE_SIZES[size]]
}

export function getFootballTeamName(footballTeamId: FootballTeamsIds | FootballNationalTeamsIds) {
  if (isNationalTeamId(footballTeamId)) return NATIONAL_TEAMS[footballTeamId].nome
  return FOOTBALL_TEAMS[footballTeamId].nome
}

export function getFootballTeamAbbreviation(
  footballTeamId: FootballTeamsIds | FootballNationalTeamsIds
) {
  if (isNationalTeamId(footballTeamId)) return NATIONAL_TEAMS[footballTeamId].abreviacao

  return FOOTBALL_TEAMS[footballTeamId].abreviacao
}
