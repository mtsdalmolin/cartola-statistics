'use client'

import { Bebas_Neue } from 'next/font/google'
import Link from 'next/link'

import { Text } from '@mantine/core'
const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'] })

export function Signature({ absolute = false }: { absolute?: boolean }) {
  return (
    <Text
      className={`${bebasNeue.className} w-full text-center ${
        absolute ? 'absolute  bottom-[1rem] left-[50%] translate-x-[-50%]' : ''
      }`}
      size="md"
    >
      feito com ⚽ por{' '}
      <Link href="https://github.com/mtsdalmolin" target="_blank">
        @mtsdalmolin
      </Link>
    </Text>
  )
}
