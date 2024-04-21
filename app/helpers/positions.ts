import { isEmpty } from 'lodash'

import { PositionOption } from '../common/types/position'
import { POSITIONS, PositionsIds, TECNICO } from '../constants/positions'

export function isGoalkeeper(positionId: number) {
  const gkPositionId = Object.keys(POSITIONS).find(
    (positionId: string) => POSITIONS[Number(positionId)].abreviacao.toLowerCase() === 'gol'
  )

  return Number(gkPositionId) === positionId
}

export function isCoach(positionId: number) {
  return TECNICO === positionId
}

export function getPositionAbbreviation(positionId: PositionsIds) {
  return POSITIONS[positionId].abreviacao
}

export function getPositionName(positionId: PositionsIds) {
  return POSITIONS[positionId].nome
}

export function getPositionOptionByValue(
  positionsOptions: PositionOption[],
  positionValue: string
): PositionOption {
  return positionsOptions.find((position) => position.value === positionValue)!
}

export function isPositionSelectedOrIsFilterEmpty<FilterCollection extends any[]>(
  positionFilters: FilterCollection,
  positionId: string
) {
  return (
    isEmpty(positionFilters) ||
    !!positionFilters.find((position: PositionOption) => position.value === positionId)
  )
}
