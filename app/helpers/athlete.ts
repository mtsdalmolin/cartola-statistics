import { Athlete } from '../common/types/athlete'

export function isAthleteFromCapeVerdeAndInTheLastGroupRound(athlete: Athlete) {
  return athlete.rodada_id === 3 && Number(athlete.clube_id) === 3201
}

export function isAthleteFromParaguayVsGermanyGame(athlete: Athlete) {
  return athlete.rodada_id === 4 && Number(athlete.clube_id) === 2354
}
