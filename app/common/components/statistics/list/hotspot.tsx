import { ReactNode, useRef } from 'react'

import NextImage from 'next/image'
import { useParams } from 'next/navigation'

import { useExtractImageContext } from '@/app/common/contexts/extract-image-context.client'
import { useTeamInfoContext } from '@/app/common/contexts/team-info-context.client'
import { ActionIcon, Text, Tooltip } from '@mantine/core'
import { IconShare } from '@tabler/icons-react'

import { Flex } from '../../flex'

export function ListHotspot({
  name,
  imgName,
  imgSrc,
  data,
  details
}: {
  name: string
  imgName: string
  imgSrc: string
  data: string | ReactNode
  details?: ReactNode
}) {
  const params = useParams()
  const hotspotRef = useRef(null)
  const { createImageAndSaveInBlobStore } = useExtractImageContext()
  const { teamInfo } = useTeamInfoContext()

  const renderedHtml = (
    <Flex
      ref={hotspotRef}
      className="bg-palette-neutral-900 pb-4"
      align="center"
      justify="between"
      gap="sm"
    >
      <Flex align="center" gap="sm" direction="column">
        <Tooltip className="absolute right-3 top-2" label="Compartilhar estatística no twitter">
          <ActionIcon
            onClick={() =>
              createImageAndSaveInBlobStore({
                element: hotspotRef.current!,
                imgName,
                teamId: teamInfo?.id ?? +(params.teamId as string) ?? 0
              })
            }
          >
            <IconShare />
          </ActionIcon>
        </Tooltip>
        <Text>{name}</Text>
        <NextImage className="rounded-b-full" alt={name} src={imgSrc} width={70} height={70} />
        {data}
      </Flex>
      {details}
    </Flex>
  )

  return renderedHtml
}
