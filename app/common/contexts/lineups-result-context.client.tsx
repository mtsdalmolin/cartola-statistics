'use client'

import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react'

import { GetTeamsStatisticsActionState } from '@/app/actions'

export type LineupsResult = Partial<GetTeamsStatisticsActionState['data']>

const LineupsResultContext = createContext<{
  lineupsResult?: LineupsResult
  setLineupsResult?: Dispatch<SetStateAction<LineupsResult>>
}>({})

export function LineupsResultContextProvider({ children }: { children: ReactNode }) {
  const [lineupsResult, setLineupsResult] = useState<LineupsResult>({})

  return (
    <LineupsResultContext.Provider
      value={{
        lineupsResult,
        setLineupsResult
      }}
    >
      {children}
    </LineupsResultContext.Provider>
  )
}

export function useLineupsResultContext() {
  return useContext(LineupsResultContext)
}
