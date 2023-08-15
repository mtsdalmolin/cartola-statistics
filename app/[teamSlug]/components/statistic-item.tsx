type StatisticValue = number | string

interface StatisticItemProps {
  canRender: () => boolean
  label: string
  title: string
  value: StatisticValue
}

export function StatisticItem({ canRender, label, title, value }: StatisticItemProps) {
  return canRender()
    ? (
      <div className="flex justify-between">
        <span title={title}>{label}</span>
        <span>{value}</span>
      </div>
    )
    : null
}