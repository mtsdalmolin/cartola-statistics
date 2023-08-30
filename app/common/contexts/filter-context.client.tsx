'use client'

import { StatisticOption } from '@/app/constants/statistics'
import { ReactNode, RefObject, createContext, useContext, useState } from 'react'
import type { SelectInstance, MultiValue } from 'react-select'

type OrderFilters = MultiValue<StatisticOption>

const FilterContext = createContext<{
  orderFilters: OrderFilters
  handleOnStatisticsClick: (selectedOption: StatisticOption, selectRef: RefObject<SelectInstance<StatisticOption, true>>) => void,
  handleOnStatisticSelect: (selectedOptions: OrderFilters) => void,
}>({
  orderFilters: [],
  handleOnStatisticsClick: () => {},
  handleOnStatisticSelect: () => {}
})

export function FilterContextProvider({ children, initialStateValue }: { children: ReactNode, initialStateValue: StatisticOption[] }) {
  const [orderFilters, setOrderFilters] = useState<OrderFilters>(initialStateValue);

  const handleOnStatisticsClick = (selectedOption: StatisticOption, selectRef: RefObject<SelectInstance<StatisticOption, true>>) => {
    if (selectRef.current) {
      const currentValue = selectRef.current.getValue()
  
      if (currentValue.some(option => option.value === selectedOption.value)) {
        selectRef.current.onChange(
          currentValue.filter(option => option.value !== selectedOption.value),
          {} as any
        )
        return
      }
  
      selectRef.current.onChange([...currentValue, selectedOption], {} as any)
    }
  }

  const handleOnStatisticSelect = (selectedOptions: OrderFilters) => setOrderFilters(selectedOptions)

  return (
    <FilterContext.Provider value={{ orderFilters, handleOnStatisticsClick, handleOnStatisticSelect }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilterContext() {
  return useContext(FilterContext)
}
