import { Athlete } from '../common/types/athlete'
import { SCOUT_COLORS, SCOUT_MULTIPLIERS, SCOUT_TITLES } from '../constants/athlete-scout'

export function getScoutName(scoutKey: keyof typeof SCOUT_TITLES, getAbbreviation = false) {
  return SCOUT_TITLES[scoutKey][getAbbreviation ? 'abbreviation' : 'title']
}

export function getScoutMultipliedValue(scoutValue: number, scoutKey: string) {
  return scoutValue * SCOUT_MULTIPLIERS[scoutKey as keyof Athlete['scout']]
}

export function getScoutColor(scoutKey: string) {
  return SCOUT_COLORS[scoutKey as keyof Athlete['scout']]
}

export function calculateScoutPoints(scout: Athlete['scout']) {
  let sumValue = 0

  Object.entries(scout).forEach(([scoutKey, scoutValue]) => {
    sumValue += getScoutMultipliedValue(scoutValue, scoutKey)
  })

  return sumValue
}
