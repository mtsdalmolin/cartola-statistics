import { getFootballTeamBadgeLink, getFootballTeamName } from '@/app/helpers/teams'
import { typedOrderBy } from '@/app/helpers/typed-lodash'

import { ClubStatistics } from '../../types/athlete'
import { StatisticsList } from './list'
import { ListHotspot } from './list/hotspot'
import { ListItem } from './list/item'
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
      <ListHotspot
        name={getFootballTeamName(first.id)}
        imgSrc={getFootballTeamBadgeLink(first.id, 'lg')}
        data={`${first.pointsPercentage.toFixed(1)}%`}
      />

      <StatisticsList>
        {orderedClubsData.map((club, idx) => (
          <ListItem
            key={club.id}
            name={getFootballTeamName(club.id)}
            imgSrc={getFootballTeamBadgeLink(club.id, 'lg')}
            data={`${club.pointsPercentage.toFixed(1)}%`}
            position={idx + 2}
          />
        ))}
      </StatisticsList>
    </SummaryContainer>
  )
}
