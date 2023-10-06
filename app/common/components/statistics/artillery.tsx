import Image from 'next/image'

import { typedOrderBy } from '@/app/helpers/typed-lodash'
import { Text } from '@mantine/core'

import { take } from 'lodash'

import { CrewStatistics } from '../../types/athlete'
import { Flex } from '../flex'
import { SummaryContainer } from './summary-container'

export function Artillery<TCrewData extends CrewStatistics>({ crewData }: { crewData: TCrewData }) {
  const orderedArtilleryData = typedOrderBy(Object.values(crewData), 'goals', 'desc').filter(
    (athlete) => athlete.goals > 0
  )
  const first = orderedArtilleryData[0]
  orderedArtilleryData.shift()
  return (
    <SummaryContainer title="Artilharia">
      <Flex key={first.atleta_id} align="center" gap="sm" direction="column">
        <Text>{first.apelido}</Text>
        <Image
          className="rounded-full"
          alt={first.apelido}
          src={first.foto ?? ''}
          width={75}
          height={75}
        />
        {first.goals} gols
      </Flex>

      <Flex className="divide-y divide-gray-500" direction="column">
        {take(orderedArtilleryData, 9).map((athlete, idx) => (
          <Flex
            key={athlete.atleta_id}
            className="w-full pt-2"
            justify="between"
            align="center"
            gap="sm"
          >
            <span>{idx + 2}º</span>
            <Flex align="center" gap="sm">
              <Image alt={athlete.apelido} src={athlete.foto ?? ''} width={45} height={45} />
              <Text>{athlete.apelido}</Text>
            </Flex>
            {athlete.goals} gols
          </Flex>
        ))}
      </Flex>
    </SummaryContainer>
  )
}
