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

export const CHAMPION_TEAM_IDS = [
  2318, // brasil
  2326, // espanha
  2356, // uruguai
  2357, // argentina
  2370, // inglaterra
  2384, // alemanha
  2385, // frança
]

export const AFC_TEAM_IDS = [2369, 2374, 2336, 2333, 2344, 3238, 3231, 3061, 2342]

export const CAF_TEAM_IDS = [2332, 2347, 2324, 2350, 2338, 2358, 2337, 2375, 3201, 3184]

export const CONCACAF_TEAM_IDS = [2365, 2360, 2361, 3062, 2334, 3221]

export const CONMEBOL_TEAM_IDS = [2318, 2357, 2356, 2373, 2372, 2354]

export const OFC_TEAM_IDS = [2340]

export const UEFA_TEAM_IDS = [
  2384, 2385, 2370, 2326, 2390, 2392, 2381, 2379, 2320, 2391, 2323, 2327, 2865, 2352, 2328, 2368
]

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
