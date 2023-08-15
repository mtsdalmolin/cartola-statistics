import { getAthleteStatisticsByPositionId } from "@/app/helpers/positions"
import { StatisticItem } from "./statistic-item"
import { RenderedAthlete } from "../page"

export function AthleteStatistics({ athlete }: { athlete: RenderedAthlete }) {
  const statistics = getAthleteStatisticsByPositionId(athlete)
  return (
    <div className="flex flex-col gap-0.5 h-[70%] divide-y overflow-auto hover:overscroll-contain hide-scroll">
      {
        statistics.map(statistic => (
          <StatisticItem key={statistic.label} {...statistic} />
        ))
      }
    </div>
  )
}