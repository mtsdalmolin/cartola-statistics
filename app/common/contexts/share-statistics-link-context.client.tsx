'use client'

import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react'

import { URLS } from '@/app/constants/url'

const ShareStatisticsLinkContext = createContext<{
  getShareLinkWithHighlight: (highlight: string, withRoundIdQueryParam?: boolean) => string
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

  const getShareLinkWithHighlight = (highlight: string, withRoundIdQueryParam = false) => {
    const baseUrl = `${URLS.cartolaStatisticsPage}/${highlight}/${teamId ?? ''}`

    return withRoundIdQueryParam
      ? `${baseUrl}?roundId=${roundId ?? ''}&link=share`
      : `${baseUrl}?link=share`
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
