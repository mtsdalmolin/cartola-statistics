'use client'

import Link from 'next/link'

import { ActionIcon } from '@mantine/core'
import { IconBrandGithub } from '@tabler/icons-react'

export function GithubButton() {
  return (
    <Link href="https://github.com/mtsdalmolin/cartola-statistics" target="_blank">
      <ActionIcon>
        <IconBrandGithub></IconBrandGithub>
      </ActionIcon>
    </Link>
  )
}
