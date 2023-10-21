import { useEffect, useRef } from 'react'

import { Bebas_Neue } from 'next/font/google'
import Image from 'next/image'

import { TeamInfo } from '../../types/team'
import { TrophiesData } from '../../types/trophies'
import { Flex } from '../flex'
import { Trophies } from './trophies'

const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'] })

export function TeamProfile({
  teamInfo,
  trophies,
  apiHasEndedRequestsAndReturnedData
}: {
  teamInfo: TeamInfo
  trophies: TrophiesData
  apiHasEndedRequestsAndReturnedData?: boolean
}) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (apiHasEndedRequestsAndReturnedData) {
      sectionRef.current?.scrollIntoView({
        behavior: 'smooth'
      })
    }
  }, [apiHasEndedRequestsAndReturnedData])

  return (
    <section ref={sectionRef}>
      <Flex justify="center" align="center" direction="column">
        <h1 className={`${bebasNeue.className} text-5xl`}>{teamInfo.name}</h1>
        <Image src={teamInfo.badgePhotoUrl ?? ''} width={180} height={180} alt="Escudo do time" />
        <Trophies trophies={trophies} />
      </Flex>
    </section>
  )
}
