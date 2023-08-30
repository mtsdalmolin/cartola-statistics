import { FOOTBALL_TEAMS, type FootballTeamsIds } from '../constants/teams'

export function getFootballTeamBadgeLink(footballTeamId: FootballTeamsIds) {
  return FOOTBALL_TEAMS[footballTeamId].escudos['30x30']
}

export function getFootballTeamName(footballTeamId: FootballTeamsIds) {
  return FOOTBALL_TEAMS[footballTeamId].nome
}

export function getFootballTeamAbbreviation(footballTeamId: FootballTeamsIds) {
  return FOOTBALL_TEAMS[footballTeamId].abreviacao
}
