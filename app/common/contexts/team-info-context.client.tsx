'use client'

import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react'

import { TeamInfo } from '../types/team'

const TeamInfoContext = createContext<{
  teamInfo?: TeamInfo | null
  setTeamInfo?: Dispatch<SetStateAction<TeamInfo | null>>
}>({})

export function TeamInfoContextProvider({ children }: { children: ReactNode }) {
  const [teamInfo, setTeamInfo] = useState<TeamInfo | null>(null)

  return (
    <TeamInfoContext.Provider
      value={{
        teamInfo,
        setTeamInfo
      }}
    >
      {children}
    </TeamInfoContext.Provider>
  )
}

export function useTeamInfoContext() {
  return useContext(TeamInfoContext)
}
