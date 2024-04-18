'use client'

import { Flex } from './common/components/flex'
import { LoadingFallback } from './common/components/loading-fallback'

export default function LoadingPage() {
  return (
    <Flex className="m-auto min-h-screen" align="center" justify="center">
      <LoadingFallback message="Carregando..." fullScreen />
    </Flex>
  )
}
