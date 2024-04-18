import Image from 'next/image'

import edcLogo from '@/public/logo/edc-logo.svg'

import { Flex } from './flex'

export function LoadingFallback({
  message,
  fullScreen = false
}: {
  message?: string
  fullScreen?: boolean
}) {
  return (
    <Flex
      className={fullScreen ? 'w-full h-screen' : 'w-full min-h-[350px]'}
      direction="column"
      justify="center"
      align="center"
      gap="lg"
    >
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
