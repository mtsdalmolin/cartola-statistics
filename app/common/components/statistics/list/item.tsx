import Image from 'next/image'

import { Text } from '@mantine/core'

import { Flex } from '../../flex'

export function ListItem({
  name,
  imgSrc,
  imgSize = 30,
  data,
  position
}: {
  name: string
  imgSrc: string
  imgSize?: number
  data: string
  position: number
}) {
  return (
    <Flex className="w-full pt-2" justify="between" align="center" gap="sm">
      <span>{position}º</span>
      <Flex align="center" gap="sm">
        <Image alt={name} src={imgSrc} width={imgSize} height={imgSize} />
        <Text>{name}</Text>
      </Flex>
      {data}
    </Flex>
  )
}
