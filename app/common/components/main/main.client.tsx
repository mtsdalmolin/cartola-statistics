'use client'

import { ReactNode } from 'react'

import { useClient } from '@/app/helpers/hooks/use-client'
import { MantineProvider } from '@mantine/core'

import { LoadingFallback } from '../loading-fallback'

export function Main({ children, className }: { children: ReactNode; className?: string }) {
  const isClient = useClient()

  return isClient ? (
    <MantineProvider
      theme={{
        colorScheme: 'dark',
        colors: {
          teal: [
            '#eafbf5',
            '#c3efe0',
            '#aaecd6',
            '#68f3c5',
            '#7ae1bf',
            '#67bfa0',
            '#5aa68b',
            '#218563',
            '#1c7a5b',
            '#13533e'
          ]
        },
        primaryColor: 'teal'
      }}
    >
      <main className={className}>{children}</main>
    </MantineProvider>
  ) : (
    <LoadingFallback message="Carregando..." fullScreen />
  )
}
