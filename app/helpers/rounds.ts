import { isEmpty } from 'lodash'

import { RoundData } from '../services/types'

export function isValidRound(round: RoundData) {
  return !isEmpty(round.atletas)
}
