'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Tabs } from '@mantine/core'

export function PageClientTabs() {
  const pathname = usePathname()

  return (
    <Tabs value={pathname}>
      <nav>
        <Tabs.List position="apart" grow>
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
