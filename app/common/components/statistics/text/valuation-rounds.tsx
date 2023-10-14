export function ValuationRoundsText({
  valuatedRoundsAboveZero,
  valuationValue,
  isAbbreviated = false
}: {
  valuatedRoundsAboveZero: number
  valuationValue: number
  isAbbreviated?: boolean
}) {
  if (isAbbreviated)
    return (
      <span>
        {`${valuatedRoundsAboveZero} rds.`}(
        <span className={valuationValue > 0 ? 'text-palette-primary-700' : 'text-red-500'}>
          {valuationValue > 0 ? `+${valuationValue.toFixed(1)}` : valuationValue.toFixed(1)}
        </span>
        )
      </span>
    )
  return (
    <span>
      {`${valuatedRoundsAboveZero} rodada${valuatedRoundsAboveZero > 1 ? 's' : ''}`} (
      <span className={valuationValue > 0 ? 'text-palette-primary-700' : 'text-red-500'}>
        {valuationValue > 0 ? `+${valuationValue.toFixed(1)}` : valuationValue.toFixed(1)}
      </span>
      )
    </span>
  )
}
