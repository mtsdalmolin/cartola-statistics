'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFormState } from 'react-dom'

import Image from 'next/image'

import brand from '@/public/logo/brand.svg'

import { isEmpty, isNil } from 'lodash'

import { getTeamStatistics } from './actions'
import { SearchTeamStatisticsForm } from './common/components/forms/search-team-statistics'
import { Signature } from './common/components/signature'
import TeamStatisticsContent from './common/content/team-statistics'
import { useLineupsResultContext } from './common/contexts/lineups-result-context.client'
import { useSelectedYearContext } from './common/contexts/selected-year-context.client'
import { ShareStatisticsLinkContextProvider } from './common/contexts/share-statistics-link-context.client'
import { useTeamInfoContext } from './common/contexts/team-info-context.client'

export default function Home() {
  const { selectedYear } = useSelectedYearContext()
  const { setLineupsResult } = useLineupsResultContext()
  const { setCurrentRound, setTeamInfo } = useTeamInfoContext()

  const updatedActionWithYear = useMemo(
    () =>
      getTeamStatistics.bind(null, {
        year: selectedYear
      }),
    [selectedYear]
  )

  const [state, formAction] = useFormState(updatedActionWithYear, {
    message: null,
    data: null
  })

  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!isEmpty(state.data)) {
      setLineupsResult && setLineupsResult(state.data)
      if (!isNil(setTeamInfo)) {
        setTeamInfo(state.data.teamInfo)
      }

      if (!isNil(setCurrentRound)) {
        setCurrentRound(Object.keys(state.data.rounds).length)
      }
    }
  }, [state.data, setCurrentRound, setTeamInfo, setLineupsResult])

  useEffect(() => {
    formRef.current?.requestSubmit()
  }, [updatedActionWithYear])

  return (
    <div className="w-full">
      <ShareStatisticsLinkContextProvider>
        <div className="relative flex h-[100svh]">
          <div className="m-auto w-fit">
            <Image src={brand} width={500} height={500} alt="brand" />
            <SearchTeamStatisticsForm ref={formRef} action={formAction} />
            <Signature absolute />
          </div>
        </div>
        <TeamStatisticsContent />
      </ShareStatisticsLinkContextProvider>
    </div>
  )
}
