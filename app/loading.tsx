'use client'

import { Loader } from '@mantine/core';
import { Flex } from './common/components/flex';

export default function LoadingPage() {
  return (
    <Flex
      className="w-full min-h-screen"
      align="center"
      justify="center"
    >
      <Loader />
    </Flex>
  )
}