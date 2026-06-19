'use client'

import { usePathname } from 'next/navigation'

import { Flex } from './common/components/flex'
import { LoadingFallback } from './common/components/loading-fallback'

export default function LoadingPage() {
  const pathname = usePathname()
  return (
    <Flex className="m-auto min-h-screen" align="center" justify="center">
      <LoadingFallback message="Carregando..." fullScreen isWorldCup={pathname.includes('copa')} />
    </Flex>
  )
}
