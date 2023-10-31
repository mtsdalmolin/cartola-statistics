'use client'

import { experimental_useFormState as useFormState } from 'react-dom'

import Image from 'next/image'

import brand from '@/public/logo/brand.svg'

import { getTeamStatistics } from './actions'
import { SearchTeamStatisticsForm } from './common/components/forms/search-team-statistics'
import { Signature } from './common/components/signature'
import TeamStatisticsContent from './common/content/team-statistics'
import { ShareStatisticsLinkContextProvider } from './common/contexts/share-statistics-link-context.client'

export default function Home() {
  const [state, formAction] = useFormState(getTeamStatistics, {
    message: null,
    data: null
  })

  return (
    <div className="w-full">
      <ShareStatisticsLinkContextProvider>
        <div className="relative flex h-[100vh]">
          <div className="m-auto w-fit">
            <Image src={brand} width={500} height={500} alt="brand" />
            <SearchTeamStatisticsForm action={formAction} />
            <Signature absolute />
          </div>
        </div>
        <TeamStatisticsContent data={state.data} />
      </ShareStatisticsLinkContextProvider>
    </div>
  )
}
