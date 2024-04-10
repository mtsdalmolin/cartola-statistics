import { getPositionName } from '@/app/helpers/positions'
import { Progress } from '@mantine/core'

import { max, uniqueId } from 'lodash'

export function PositionsPoints({
  positions,
  totalPoints
}: {
  positions: Record<string, number>
  totalPoints: number
}) {
  const highestPositionPoints = max(Object.values(positions))
  return (
    <div className="grow-[3] w-fit">
      {Object.entries(positions).map(([positionId, positionPoints]) => (
        <div key={uniqueId(positionId)}>
          <div className="progress-label flex justify-between w-full text-xs text-left">
            <span>{getPositionName(+positionId)}</span>
            <span>{((positionPoints * 100) / totalPoints).toFixed(1)}%</span>
          </div>
          <Progress
            className="progress-data"
            radius="xs"
            size="xl"
            sections={[
              {
                value: (positionPoints * 100) / (highestPositionPoints ?? totalPoints),
                color: '#104936',
                label: `${positionPoints.toFixed(1)} pts.`,
                tooltip: <>{positionPoints.toFixed(1)} pts.</>
              }
            ]}
          />
        </div>
      ))}
    </div>
  )
}
