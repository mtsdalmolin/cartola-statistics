'use client'

import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react'

import { URLS } from '@/app/constants/url'

const ShareStatisticsLinkContext = createContext<{
  shareLink: string
  setTeamIdInShareLink: Dispatch<SetStateAction<null>>
}>({ shareLink: '', setTeamIdInShareLink: () => {} })

export function ShareStatisticsLinkContextProvider({ children }: { children: ReactNode }) {
  const [teamId, setTeamId] = useState(null)

  return (
    <ShareStatisticsLinkContext.Provider
      value={{
        shareLink: `${URLS.cartolaStatisticsPage}/estatisticas/${teamId ?? ''}`,
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
