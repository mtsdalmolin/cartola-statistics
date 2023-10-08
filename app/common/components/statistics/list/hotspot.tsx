import { ReactNode } from 'react'

import Image from 'next/image'

import { Text } from '@mantine/core'

import { Flex } from '../../flex'

export function ListHotspot({
  name,
  imgSrc,
  data,
  details
}: {
  name: string
  imgSrc: string
  data: string | ReactNode
  details?: ReactNode
}) {
  return (
    <Flex align="center" justify="between" gap="sm">
      <Flex align="center" gap="sm" direction="column">
        <Text>{name}</Text>
        <Image className="rounded-b-full" alt={name} src={imgSrc} width={70} height={70} />
        {data}
      </Flex>
      {details}
    </Flex>
  )
}
