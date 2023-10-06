import { orderBy } from 'lodash'

export type PossibleOrders = 'asc' | 'desc'

export function typedOrderBy<
  TCollection extends ReadonlyArray<TCollection[0]>,
  TKeyToOrder extends
    | keyof TCollection[0]
    | [keyof TCollection[0], ...ReadonlyArray<keyof TCollection[0]>]
>(
  collection: TCollection,
  keyToOrder: TKeyToOrder,
  orders?: TKeyToOrder extends ReadonlyArray<keyof TCollection[0]>
    ? { [ObjKey in keyof TKeyToOrder]: PossibleOrders }
    : PossibleOrders
) {
  return orderBy(collection, keyToOrder, orders)
}
