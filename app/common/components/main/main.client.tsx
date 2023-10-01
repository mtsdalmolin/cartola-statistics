'use client'

import { ReactNode } from 'react'

import { useClient } from '@/app/helpers/hooks/use-client'
import { MantineProvider } from '@mantine/core'

export function Main({ children, className }: { children: ReactNode; className?: string }) {
  const isClient = useClient()

  return isClient ? (
    <MantineProvider theme={{ colorScheme: 'dark' }}>
      <main className={className}>{children}</main>
    </MantineProvider>
  ) : null
}
