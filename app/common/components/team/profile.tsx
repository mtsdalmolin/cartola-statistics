import { useEffect, useRef } from 'react'

import { Bebas_Neue } from 'next/font/google'
import Image from 'next/image'

import { RoundMatchesData } from '@/app/services/types'
import { Text } from '@mantine/core'

import { TeamInfo } from '../../types/team'
import { TrophiesData } from '../../types/trophies'
import { Flex } from '../flex'
import { Trophies } from './trophies'

const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'] })

function TeamTurnData({
  average,
  total,
  isFirstTurn = false
}: {
  average: number
  total: number
  isFirstTurn?: boolean
}) {
  return (
    <>
      <Text className={`${bebasNeue.className} text-2xl`}>{isFirstTurn ? 'Turno' : 'Returno'}</Text>
      <Flex align="center" direction="column">
        <Text>
          Total de <b className={bebasNeue.className}>{total.toFixed(1)}</b> pts.
        </Text>
        <Text>
          Média de <b className={bebasNeue.className}>{average.toFixed(1)}</b> pts. por rodada
        </Text>
      </Flex>
    </>
  )
}

export function TeamProfile({
  matchesData,
  teamInfo,
  trophies,
  apiHasEndedRequestsAndReturnedData
}: {
  matchesData: RoundMatchesData
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
      <Flex className={bebasNeue.className} justify="center" align="center" direction="column">
        <h1 className="text-5xl">{teamInfo.name}</h1>
        <Flex className="mobile:flex-col" align="center" gap="lg">
          <Image src={teamInfo.badgePhotoUrl ?? ''} width={180} height={180} alt="Escudo do time" />
          <Flex align="center" direction="column">
            <TeamTurnData
              average={teamInfo.pointsPerTurn.first.average}
              total={teamInfo.pointsPerTurn.first.total}
              isFirstTurn
            />
            <TeamTurnData
              average={teamInfo.pointsPerTurn.second.average}
              total={teamInfo.pointsPerTurn.second.total}
            />
          </Flex>
        </Flex>
        <Trophies matchesData={matchesData} trophies={trophies} />
      </Flex>
    </section>
  )
}
