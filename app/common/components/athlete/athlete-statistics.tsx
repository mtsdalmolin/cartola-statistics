import { getAthleteStatistics } from "@/app/helpers/positions"
import { RenderedAthlete } from "../../types/athlete"
import { StatisticItem } from "../statistic-item"

export function AthleteStatistics({ athlete }: { athlete: RenderedAthlete }) {
  const statistics = getAthleteStatistics(athlete)
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