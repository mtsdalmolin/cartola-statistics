'use client'

import { ReactNode, RefObject, createContext, useContext, useState } from 'react'
import type { SelectInstance, MultiValue } from 'react-select'
import { StatisticOption } from '@/app/constants/statistics'

type OrderFilters = MultiValue<StatisticOption>

const OrderContext = createContext<{
  orderFilters: OrderFilters
  handleOnStatisticsClick: (
    selectedOption: StatisticOption,
    selectRef: RefObject<SelectInstance<StatisticOption, true>>
  ) => void
  handleOnStatisticSelect: (selectedOptions: OrderFilters) => void
}>({
  orderFilters: [],
  handleOnStatisticsClick: () => {},
  handleOnStatisticSelect: () => {}
})

export function OrderContextProvider({
  children,
  initialStateValue
}: {
  children: ReactNode
  initialStateValue: StatisticOption[]
}) {
  const [orderFilters, setOrderFilters] = useState<OrderFilters>(initialStateValue)

  const handleOnStatisticsClick = (
    selectedOption: StatisticOption,
    selectRef: RefObject<SelectInstance<StatisticOption, true>>
  ) => {
    if (selectRef.current) {
      const currentValue = selectRef.current.getValue()

      if (currentValue.some((option) => option.value === selectedOption.value)) {
        selectRef.current.onChange(
          currentValue.filter((option) => option.value !== selectedOption.value),
          {} as any
        )
        return
      }

      selectRef.current.onChange([...currentValue, selectedOption], {} as any)
    }
  }

  const handleOnStatisticSelect = (selectedOptions: OrderFilters) =>
    setOrderFilters(selectedOptions)

  return (
    <OrderContext.Provider
      value={{ orderFilters, handleOnStatisticsClick, handleOnStatisticSelect }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export function useOrderContext() {
  return useContext(OrderContext)
}
