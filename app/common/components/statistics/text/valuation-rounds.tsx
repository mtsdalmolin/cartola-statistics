export function ValuationRoundsText({
  valuedRoundsAboveZero,
  valuationValue,
  isAbbreviated = false
}: {
  valuedRoundsAboveZero: number
  valuationValue: number
  isAbbreviated?: boolean
}) {
  if (isAbbreviated)
    return (
      <span>
        {`${valuedRoundsAboveZero} rds.`}(
        <span className={valuationValue > 0 ? 'text-palette-primary-700' : 'text-red-500'}>
          {valuationValue > 0 ? `+${valuationValue.toFixed(1)}` : valuationValue.toFixed(1)}
        </span>
        )
      </span>
    )
  return (
    <span>
      {`${valuedRoundsAboveZero} rodada${valuedRoundsAboveZero > 1 ? 's' : ''}`} (
      <span className={valuationValue > 0 ? 'text-palette-primary-700' : 'text-red-500'}>
        {valuationValue > 0 ? `+${valuationValue.toFixed(1)}` : valuationValue.toFixed(1)}
      </span>
      )
    </span>
  )
}
