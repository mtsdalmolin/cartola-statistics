import { OPTIONS, type StatisticOption } from '@/app/constants/statistics'
import { getAthleteStatistics } from '@/app/helpers/statistics'

import { RenderedAthlete } from '../../types/athlete'
import { StatisticItem } from '../statistic-item'

export function AthleteStatistics({
  athlete,
  handleStatisticClick
}: {
  athlete: RenderedAthlete
  handleStatisticClick: (selectedOption: StatisticOption) => void
}) {
  const statistics = getAthleteStatistics(athlete)

  return (
    <div className="flex flex-col gap-0.5 h-[70%] divide-y overflow-auto hover:overscroll-contain hide-scroll">
      {statistics.map((statistic) => (
        <StatisticItem
          key={statistic.label}
          handleStatisticClick={() => handleStatisticClick(OPTIONS[statistic.id])}
          {...statistic}
        />
      ))}
    </div>
  )
}
