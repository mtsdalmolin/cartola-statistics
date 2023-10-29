'use client'

import { experimental_useFormState as useFormState } from 'react-dom'

import { Bebas_Neue } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'

import brand from '@/public/logo/brand.svg'
import { Text } from '@mantine/core'

import { getTeamStatistics } from './actions'
import { SearchTeamStatisticsForm } from './common/components/forms/search-team-statistics'
import TeamStatisticsContent from './common/content/team-statistics'

const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'] })

export default function Home() {
  const [state, formAction] = useFormState(getTeamStatistics, {
    message: null,
    data: null
  })

  return (
    <div className="w-full">
      <div className="relative flex h-[100vh]">
        <div className="m-auto w-fit">
          <Image src={brand} width={500} height={500} alt="brand" />
          <SearchTeamStatisticsForm action={formAction} />
          <Text
            className={`${bebasNeue.className} w-max text-center absolute bottom-[1rem] left-[50%] translate-x-[-50%]`}
            size="md"
          >
            feito com ⚽ por{' '}
            <Link href="https://github.com/mtsdalmolin" target="_blank">
              @mtsdalmolin
            </Link>
          </Text>
        </div>
      </div>
      <TeamStatisticsContent data={state.data} />
    </div>
  )
}
