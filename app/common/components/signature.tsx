'use client'

import { Bebas_Neue } from 'next/font/google'
import Link from 'next/link'

import { Text } from '@mantine/core'

import { Flex } from './flex'
import { GithubButton } from './github-button.client'
const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'] })

export function Signature({ absolute = false }: { absolute?: boolean }) {
  return (
    <Flex
      className={` w-full text-center ${
        absolute ? 'absolute  bottom-[1rem] left-[50%] translate-x-[-50%]' : ''
      }`}
      justify="center"
      align="center"
    >
      <GithubButton />
      <Text className={bebasNeue.className} size="md">
        feito com ⚽ por{' '}
        <Link href="https://twitter.com/mtsdalmolin" target="_blank">
          @mtsdalmolin
        </Link>
      </Text>
    </Flex>
  )
}
