import Image from 'next/image'

import { getFootballTeamBadgeLink, getFootballTeamName } from '@/app/helpers/teams'
import { typedOrderBy } from '@/app/helpers/typed-lodash'
import { Text } from '@mantine/core'

import { ClubStatistics } from '../../types/athlete'
import { Flex } from '../flex'
import { SummaryContainer } from './summary-container'

export function LineupsPerTeam<TClubsData extends ClubStatistics>({
  clubsData
}: {
  clubsData: TClubsData
}) {
  const orderedClubsData = typedOrderBy(Object.values(clubsData), 'pointsPercentage', 'desc')
  const first = orderedClubsData[0]
  orderedClubsData.shift()
  return (
    <SummaryContainer title="Times mais escalados">
      <Flex key={first.id} align="center" gap="sm" direction="column">
        <Text>{getFootballTeamName(first.id)}</Text>
        <Image
          alt={getFootballTeamName(first.id)}
          src={getFootballTeamBadgeLink(first.id, 'lg')}
          width={70}
          height={70}
        />
        {first.pointsPercentage.toFixed(1)}%
      </Flex>

      <Flex className="divide-y divide-gray-500" direction="column">
        {orderedClubsData.map((club, idx) => (
          <Flex key={club.id} className="w-full pt-2" justify="between" align="center" gap="sm">
            <span>{idx + 2}º</span>
            <Flex>
              <Image
                alt={getFootballTeamName(club.id)}
                src={getFootballTeamBadgeLink(club.id, 'lg')}
                width={30}
                height={30}
              />
              <Text>{getFootballTeamName(club.id)}</Text>
            </Flex>
            {club.pointsPercentage.toFixed(1)}%
          </Flex>
        ))}
      </Flex>
    </SummaryContainer>
  )
}
