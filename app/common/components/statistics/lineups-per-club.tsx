import { useParams } from 'next/navigation'

import { HIGHLIGHT_TO_PARAM } from '@/app/constants/highlight'
import { getFootballTeamBadgeLink, getFootballTeamName } from '@/app/helpers/teams'
import { typedOrderBy } from '@/app/helpers/typed-lodash'

import { ClubStatistics } from '../../types/athlete'
import { PositionsPercentage } from './details/positions-percentage'
import { StatisticsList } from './list'
import { ListHotspot } from './list/hotspot'
import { ListItem } from './list/item'
import { SummaryContainer } from './summary-container'

const ELEMENT_ID = HIGHLIGHT_TO_PARAM['lineups-per-club']

export function LineupsPerClub<TClubsData extends ClubStatistics>({
  clubsData
}: {
  clubsData: TClubsData
}) {
  const { highlight } = useParams()

  const orderedClubsData = typedOrderBy(Object.values(clubsData), 'lineupNumbers', 'desc')
  const first = orderedClubsData[0]
  orderedClubsData.shift()

  return (
    <SummaryContainer id={ELEMENT_ID} title="Times mais escalados" focus={highlight === ELEMENT_ID}>
      <ListHotspot
        imgName={`lineups-per-club_${getFootballTeamName(first.id)}`}
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
