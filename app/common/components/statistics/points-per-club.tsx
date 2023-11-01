import { getFootballTeamBadgeLink, getFootballTeamName } from '@/app/helpers/teams'
import { typedOrderBy } from '@/app/helpers/typed-lodash'

import { ClubStatistics } from '../../types/athlete'
import { PositionsPoints } from './details/positions-points'
import { StatisticsList } from './list'
import { ListHotspot } from './list/hotspot'
import { ListItem } from './list/item'
import { SummaryContainer } from './summary-container'

export function PointsPerClub<TClubsData extends ClubStatistics>({
  clubsData
}: {
  clubsData: TClubsData
}) {
  const orderedClubsData = typedOrderBy(Object.values(clubsData), 'points', 'desc')
  const first = orderedClubsData[0]
  orderedClubsData.shift()
  return (
    <SummaryContainer title="Time que mais pontuou">
      <ListHotspot
        imgName={`points-per-club-${getFootballTeamName(first.id)}`}
        name={getFootballTeamName(first.id)}
        imgSrc={getFootballTeamBadgeLink(first.id, 'lg')}
        data={`${first.points.toFixed(1)} pontos`}
        details={<PositionsPoints positions={first.positionsPoints} totalPoints={first.points} />}
      />

      <StatisticsList>
        {orderedClubsData.map((club, idx) => (
          <ListItem
            key={club.id}
            name={getFootballTeamName(club.id)}
            imgSrc={getFootballTeamBadgeLink(club.id, 'lg')}
            data={`${club.points.toFixed(1)} pts.`}
            position={idx + 2}
          />
        ))}
      </StatisticsList>
    </SummaryContainer>
  )
}
