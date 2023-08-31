import { Tooltip } from '@mantine/core'

type StatisticValue = number | string

interface StatisticItemProps {
  canRender: () => boolean
  handleStatisticClick: () => void
  label: string
  title: string
  value: StatisticValue
}

export function StatisticItem({ canRender, label, title, value, handleStatisticClick }: StatisticItemProps) {
  return canRender()
    ? (
      <div className="flex justify-between cursor-pointer hover:opacity-[0.9]" onClick={handleStatisticClick}>
        <Tooltip label={title}>
          <span>{label}</span>
        </Tooltip>
        <span>{value}</span>
      </div>
    )
    : null
}