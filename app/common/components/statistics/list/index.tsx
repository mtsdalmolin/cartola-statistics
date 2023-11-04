import { ReactNode } from 'react'

import { Flex } from '../../flex'

export function StatisticsList({ children }: { children: ReactNode }) {
  return (
    <Flex className="w-full divide-y divide-gray-500" direction="column">
      {children}
    </Flex>
  )
}
