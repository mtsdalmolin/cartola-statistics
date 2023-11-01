import { ReactElement } from 'react'

import { Flex } from '../flex'

export function SummaryContainer({
  children,
  title
}: {
  children: ReactElement | ReactElement[]
  title: string
}) {
  return (
    <div className="relative w-full rounded-md text-white bg-palette-neutral-900 h-fit p-4">
      <div className="mt-[-0.175rem] mb-4">{title}</div>
      <Flex gap="sm">{children}</Flex>
    </div>
  )
}
