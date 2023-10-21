import { Bebas_Neue } from 'next/font/google'
import Image from 'next/image'

import { TeamInfo } from '../../types/team'
import { TrophiesData } from '../../types/trophies'
import { Flex } from '../flex'
import { Trophies } from './trophies'

const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'] })

export function TeamProfile({
  teamInfo,
  trophies
}: {
  teamInfo: TeamInfo
  trophies: TrophiesData
}) {
  return (
    <Flex justify="center" align="center" direction="column">
      <h1 className={`${bebasNeue.className} text-5xl`}>{teamInfo.name}</h1>
      <Image src={teamInfo.badgePhotoUrl ?? ''} width={180} height={180} alt="Escudo do time" />
      <Trophies trophies={trophies} />
    </Flex>
  )
}
