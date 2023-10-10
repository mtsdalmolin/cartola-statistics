'use client'

import { Loader } from '@mantine/core'

import { Flex } from './common/components/flex'

export default function LoadingPage() {
  return (
    <Flex className="m-auto min-h-screen" align="center" justify="center">
      <Loader color="#7ae1bf" />
    </Flex>
  )
}
