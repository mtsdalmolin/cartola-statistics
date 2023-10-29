import Image from 'next/image'

import edcLogo from '@/public/logo/edc-logo.svg'

import { Flex } from './flex'

export function LoadingFallback({ message }: { message?: string }) {
  return (
    <Flex className="w-full h-screen" direction="column" justify="center" align="center" gap="lg">
      <Image
        className="motion-safe:animate-bounce"
        src={edcLogo}
        width={150}
        height={150}
        alt="brand"
      />
      {message ?? <p>Carregando informações do time...</p>}
    </Flex>
  )
}
