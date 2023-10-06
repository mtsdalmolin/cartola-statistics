import Image from 'next/image'

import { typedOrderBy } from '@/app/helpers/typed-lodash'
import { Text } from '@mantine/core'

import { take } from 'lodash'

import { CrewStatistics } from '../../types/athlete'
import { Flex } from '../flex'
import { SummaryContainer } from './summary-container'

export function HighestScorer<TCrewData extends CrewStatistics>({
  crewData
}: {
  crewData: TCrewData
}) {
  const orderedHighestScorerData = typedOrderBy(Object.values(crewData), 'highestPoint', 'desc')
  const first = orderedHighestScorerData[0]
  orderedHighestScorerData.shift()
  return (
    <SummaryContainer title="Maior pontuador">
      <Flex key={first.atleta_id} align="center" gap="sm" direction="column">
        <Text>{first.apelido}</Text>
        <Image
          className="rounded-full"
          alt={first.apelido}
          src={first.foto ?? ''}
          width={75}
          height={75}
        />
        {first.highestPoint.toFixed(1)}
      </Flex>

      <Flex className="divide-y divide-gray-500" direction="column">
        {take(orderedHighestScorerData, 9).map((athlete, idx) => (
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
            {athlete.highestPoint.toFixed(1)}
          </Flex>
        ))}
      </Flex>
    </SummaryContainer>
  )
}
