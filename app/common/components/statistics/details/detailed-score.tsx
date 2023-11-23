import { Athlete } from '@/app/common/types/athlete'
import { getScoutColor, getScoutMultipliedValue, getScoutName } from '@/app/helpers/athlete-scout'
import { Progress } from '@mantine/core'

export function DetailedScore({
  highestPoints,
  scout
}: {
  highestPoints: number
  scout: Athlete['scout']
}) {
  return (
    <div className="w-full">
      <div className="flex justify-between w-full text-sm text-left pb-2">
        <span>Detalhamento dos pontos</span>
      </div>
      <Progress
        radius="xs"
        size="xl"
        sections={Object.entries(scout).map(([scoutKey, scoutValue]) => ({
          value: (getScoutMultipliedValue(scoutValue, scoutKey) * 100) / highestPoints,
          color: getScoutColor(scoutKey as keyof Athlete['scout']),
          label: getScoutMultipliedValue(scoutValue, scoutKey).toFixed(1),
          tooltip: `${getScoutName(
            scoutKey as keyof Athlete['scout']
          )}: ${scoutValue} (${getScoutMultipliedValue(scoutValue, scoutKey).toFixed(1)} pts.)`
        }))}
      />
    </div>
  )
}
