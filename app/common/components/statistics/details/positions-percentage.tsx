import { getPositionName } from '@/app/helpers/positions'
import { Progress } from '@mantine/core'

import { uniqueId } from 'lodash'

export function PositionsPercentage({
  positions,
  totalSchedules
}: {
  positions: Record<string, number>
  totalSchedules: number
}) {
  return (
    <div className="grow-[3] w-fit">
      {Object.entries(positions).map(([positionId, totalScheduled]) => (
        <div key={uniqueId(positionId)}>
          <div className="progress-label flex justify-between w-full text-xs text-left">
            <span>{getPositionName(+positionId)}</span>
            <span>{((totalScheduled * 100) / totalSchedules).toFixed(1)}%</span>
          </div>
          <Progress
            className="progress-data"
            radius="xs"
            size="xl"
            sections={[
              {
                value: (totalScheduled * 100) / totalSchedules,
                color: '#104936',
                label: totalScheduled.toString()
              }
            ]}
          />
        </div>
      ))}
    </div>
  )
}
