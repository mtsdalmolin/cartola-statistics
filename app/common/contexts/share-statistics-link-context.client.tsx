'use client'

import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react'

const ShareStatisticsLinkContext = createContext<{
  shareLink: string
  setTeamIdInShareLink: Dispatch<SetStateAction<null>>
}>({ shareLink: '', setTeamIdInShareLink: () => {} })

export function ShareStatisticsLinkContextProvider({ children }: { children: ReactNode }) {
  const [teamId, setTeamId] = useState(null)

  return (
    <ShareStatisticsLinkContext.Provider
      value={{
        shareLink: `https://cartola-statistics.vercel.app/estatisticas/${teamId ?? ''}`,
        setTeamIdInShareLink: setTeamId
      }}
    >
      {children}
    </ShareStatisticsLinkContext.Provider>
  )
}

export function useShareStatisticsLinkContext() {
  return useContext(ShareStatisticsLinkContext)
}
