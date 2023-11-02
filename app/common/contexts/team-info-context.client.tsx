'use client'

import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react'

import { TeamInfo } from '../types/team'

const TeamInfoContext = createContext<{
  teamInfo?: TeamInfo | null
  setTeamInfo?: Dispatch<SetStateAction<TeamInfo | null>>
  currentRound?: number
  setCurrentRound?: Dispatch<SetStateAction<number>>
}>({})

export function TeamInfoContextProvider({ children }: { children: ReactNode }) {
  const [teamInfo, setTeamInfo] = useState<TeamInfo | null>(null)
  const [currentRound, setCurrentRound] = useState(0)

  return (
    <TeamInfoContext.Provider
      value={{
        teamInfo,
        setTeamInfo,
        currentRound,
        setCurrentRound
      }}
    >
      {children}
    </TeamInfoContext.Provider>
  )
}

export function useTeamInfoContext() {
  return useContext(TeamInfoContext)
}
