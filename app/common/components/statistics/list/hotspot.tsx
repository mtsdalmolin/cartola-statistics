import { ReactNode } from 'react'

import Image from 'next/image'

import { Text } from '@mantine/core'

import { Flex } from '../../flex'

export function ListHotspot({
  name,
  imgSrc,
  data,
  statistics
}: {
  name: string
  imgSrc: string
  data: string | ReactNode
  statistics?: ReactNode
}) {
  return (
    <Flex align="center" justify="between" gap="sm">
      <Flex align="center" gap="sm" direction="column">
        <Text>{name}</Text>
        <Image className="rounded-full" alt={name} src={imgSrc} width={70} height={70} />
        {data}
      </Flex>
      {statistics ? statistics : null}
    </Flex>
  )
}
