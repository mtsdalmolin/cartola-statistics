'use client'

import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react'

import { URLS } from '@/app/constants/url'

const ShareStatisticsLinkContext = createContext<{
  getShareLinkWithHighlight: (highlight: string) => string
  shareLink: string
  setTeamIdInShareLink: Dispatch<SetStateAction<null>>
  setRoundIdInShareLink: Dispatch<SetStateAction<number>>
}>({
  getShareLinkWithHighlight: () => '',
  shareLink: '',
  setTeamIdInShareLink: () => {},
  setRoundIdInShareLink: () => {}
})

export function ShareStatisticsLinkContextProvider({ children }: { children: ReactNode }) {
  const [teamId, setTeamId] = useState(null)
  const [roundId, setRoundId] = useState(0)

  const getShareLinkWithHighlight = (highlight: string) => {
    return `${URLS.cartolaStatisticsPage}/${highlight}/${teamId ?? ''}?roundId=${roundId ?? ''}`
  }

  return (
    <ShareStatisticsLinkContext.Provider
      value={{
        getShareLinkWithHighlight,
        shareLink: getShareLinkWithHighlight('estatisticas'),
        setTeamIdInShareLink: setTeamId,
        setRoundIdInShareLink: setRoundId
      }}
    >
      {children}
    </ShareStatisticsLinkContext.Provider>
  )
}

export function useShareStatisticsLinkContext() {
  return useContext(ShareStatisticsLinkContext)
}
