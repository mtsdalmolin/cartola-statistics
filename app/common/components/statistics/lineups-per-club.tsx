import { getFootballTeamBadgeLink, getFootballTeamName } from '@/app/helpers/teams'
import { typedOrderBy } from '@/app/helpers/typed-lodash'

import { ClubStatistics } from '../../types/athlete'
import { PositionsPercentage } from './details/positions-percentage'
import { StatisticsList } from './list'
import { ListHotspot } from './list/hotspot'
import { ListItem } from './list/item'
import { SummaryContainer } from './summary-container'

export function LineupsPerClub<TClubsData extends ClubStatistics>({
  clubsData
}: {
  clubsData: TClubsData
}) {
  const orderedClubsData = typedOrderBy(Object.values(clubsData), 'lineupNumbers', 'desc')
  const first = orderedClubsData[0]
  orderedClubsData.shift()
  return (
    <SummaryContainer title="Times mais escalados">
      <ListHotspot
        imgName={`lineups-per-club-${getFootballTeamName(first.id)}`}
        name={getFootballTeamName(first.id)}
        imgSrc={getFootballTeamBadgeLink(first.id, 'lg')}
        data={`${first.lineupNumbers} escalações`}
        details={
          <PositionsPercentage positions={first.positions} totalSchedules={first.lineupNumbers} />
        }
      />

      <StatisticsList>
        {orderedClubsData.map((club, idx) => (
          <ListItem
            key={club.id}
            name={getFootballTeamName(club.id)}
            imgSrc={getFootballTeamBadgeLink(club.id, 'lg')}
            data={`${club.lineupNumbers} esc.`}
            position={idx + 2}
          />
        ))}
      </StatisticsList>
    </SummaryContainer>
  )
}
