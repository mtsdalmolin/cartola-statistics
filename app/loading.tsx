'use client'

import { Loader } from '@mantine/core'

import { Flex } from './common/components/flex'

export default function LoadingPage() {
  return (
    <Flex className="m-auto" align="center" justify="center">
      <Loader />
    </Flex>
  )
}
