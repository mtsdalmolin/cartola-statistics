import { STATUS, type StatusIds } from "../constants/status"

export function getStatusName(positionId: StatusIds) {
  return STATUS[positionId].nome
}