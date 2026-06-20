'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Badge, Tabs } from '@mantine/core'

export function PageClientTabs() {
  const pathname = usePathname()

  return (
    <Tabs value={pathname}>
      <nav>
        <Tabs.List position="apart" grow className="h-9">
          <Link href="/copa">
            <Tabs.Tab
              className="
              data-[active]:border-palette-primary-500
              data-[active]:hover:border-palette-neutral-100
              hover:border-palette-neutral-100
                hover:bg-transparent
              "
              value="/copa"
            >
              <>
                Copa do Mundo{' '}
                <Badge size="xs" radius="xs">
                  Novo!
                </Badge>
              </>
            </Tabs.Tab>
          </Link>
          <Link href="/">
            <Tabs.Tab
              className="
              data-[active]:border-palette-primary-500
              data-[active]:hover:border-palette-neutral-100
              hover:border-palette-neutral-100
                hover:bg-transparent
              "
              value="/"
            >
              Home
            </Tabs.Tab>
          </Link>
          <Link href="/ranking">
            <Tabs.Tab
              className="
              data-[active]:border-palette-primary-500
              data-[active]:hover:border-palette-neutral-100
              hover:border-palette-neutral-100
                hover:bg-transparent
              "
              value="/ranking"
            >
              Ranking
            </Tabs.Tab>
          </Link>
        </Tabs.List>
      </nav>
    </Tabs>
  )
}
