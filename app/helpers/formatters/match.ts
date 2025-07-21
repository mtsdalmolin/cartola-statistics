import { Match } from '@/app/common/types/match'
import { FootballTeamsIds } from '@/app/constants/teams'
import { MatchFromApi } from '@/app/services/types'

import { getFootballTeamBadgeLink, getFootballTeamName } from '../teams'

export function formatMatchData(matches: MatchFromApi[]) {
  const roundMatches: { [key: string]: Match } = {}

  matches?.forEach((match) => {
    const matchAssets = {
      home: {
        clubBadgeUrl: getFootballTeamBadgeLink(match.clube_casa_id as FootballTeamsIds),
        name: getFootballTeamName(match.clube_casa_id as FootballTeamsIds)
      },
      away: {
        clubBadgeUrl: getFootballTeamBadgeLink(match.clube_visitante_id as FootballTeamsIds),
        name: getFootballTeamName(match.clube_visitante_id as FootballTeamsIds)
      },
      result: {
        home: match.placar_oficial_mandante ?? null,
        away: match.placar_oficial_visitante ?? null,
        winner:
          match.placar_oficial_mandante === match.placar_oficial_visitante
            ? 'draw'
            : match.placar_oficial_mandante > match.placar_oficial_visitante
            ? match.clube_casa_id
            : match.clube_visitante_id
      }
    }

    roundMatches[match.clube_casa_id] = matchAssets
    roundMatches[match.clube_visitante_id] = matchAssets
  })

  return roundMatches
}
