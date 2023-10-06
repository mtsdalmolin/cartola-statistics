import Image from 'next/image'

import { Text } from '@mantine/core'

import { Flex } from '../../flex'

export function ListHotspot({
  name,
  imgSrc,
  data
}: {
  name: string
  imgSrc: string
  data: string
}) {
  return (
    <Flex align="center" gap="sm" direction="column">
      <Text>{name}</Text>
      <Image className="rounded-full" alt={name} src={imgSrc} width={70} height={70} />
      {data}
    </Flex>
  )
}
