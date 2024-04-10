'use client'

import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react'

import { URLS } from '@/app/constants/url'

import { useSelectedYearContext } from './selected-year-context.client'

const ShareStatisticsLinkContext = createContext<{
  getShareLinkWithHighlight: ({}: {
    highlight: string
    year: string
    withRoundIdQueryParam?: boolean
  }) => string
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
  const { selectedYear } = useSelectedYearContext()

  const getShareLinkWithHighlight = ({
    highlight,
    year,
    withRoundIdQueryParam = false
  }: {
    highlight: string
    year: string
    withRoundIdQueryParam?: boolean
  }) => {
    const baseUrl = `${URLS.cartolaStatisticsPage}/${highlight}/${teamId ?? ''}`

    return withRoundIdQueryParam
      ? `${baseUrl}?roundId=${roundId ?? ''}&year=${year}&link=share`
      : `${baseUrl}?year=${year}&link=share`
  }

  return (
    <ShareStatisticsLinkContext.Provider
      value={{
        getShareLinkWithHighlight,
        shareLink: getShareLinkWithHighlight({
          highlight: 'estatisticas',
          year: selectedYear.toString()
        }),
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
