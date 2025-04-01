'use client'

import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react'

import { SeasonYears } from '@/app/constants/data'

export const AVAILABLE_YEARS: SeasonYears[] = [2025, 2024, 2023]

const SelectedYearContext = createContext<{
  selectedYear: SeasonYears
  setSelectedYear: Dispatch<SetStateAction<SeasonYears>>
}>({
  selectedYear: AVAILABLE_YEARS[0],
  setSelectedYear: () => {}
})

export function SelectedYearContextProvider({ children }: { children: ReactNode }) {
  const [selectedYear, setSelectedYear] = useState<SeasonYears>(AVAILABLE_YEARS[0])

  return (
    <SelectedYearContext.Provider
      value={{
        selectedYear,
        setSelectedYear
      }}
    >
      {children}
    </SelectedYearContext.Provider>
  )
}

export function useSelectedYearContext() {
  return useContext(SelectedYearContext)
}
