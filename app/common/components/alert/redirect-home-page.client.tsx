'use client'

import Link from 'next/link'

import { Alert } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'

export function RedirectHomePageAlert() {
  return (
    <Link href="/">
      <Alert
        className="w-full rounded-none bg-palette-primary-900 text-palette-neutral-200"
        icon={<IconSearch size="1rem" />}
        title="Veja as estatísticas do seu time"
      >
        Quer ver as estatísticas do seu time? Clique aqui e faça a sua pesquisa
      </Alert>
    </Link>
  )
}
