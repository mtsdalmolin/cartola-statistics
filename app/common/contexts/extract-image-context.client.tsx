'use client'

import { ReactNode, createContext, useContext, useState } from 'react'

import Link from 'next/link'

import { Flex } from '@/app/common/components/flex'
import { HIGHLIGHT_TO_PARAM } from '@/app/constants/highlight'
import { URLS } from '@/app/constants/url'
import { Notification, Text } from '@mantine/core'
import { IconBrandX } from '@tabler/icons-react'

import html2canvas from 'html2canvas'

interface BlobParamsToSave {
  element: HTMLElement
  imgName: string
  teamId: number
}

const ExtractImageContext = createContext<{
  createImageAndSaveInBlobStore: ({ element, imgName, teamId }: BlobParamsToSave) => void
}>({ createImageAndSaveInBlobStore: () => {} })

export function ExtractImageContextProvider({ children }: { children: ReactNode }) {
  const [loadingUpload, setLoadingUpload] = useState(false)
  const [uploadReturnMessage, setUploadReturnMessage] = useState('')
  const [showTweetReady, setShowTweetReady] = useState(false)
  const [teamId, setTeamId] = useState<number | null>(null)
  const [highlight, setHighlight] = useState<string | null>(null)

  const createImageAndSaveInBlobStore = ({
    element,
    imgName,
    teamId: scopedTeamId
  }: BlobParamsToSave) => {
    setLoadingUpload(true)
    setTeamId(scopedTeamId)
    setHighlight(imgName.split('_')[0])
    const mime = 'image/jpg'
    html2canvas(element)
      .then((canvas) => {
        canvas.toBlob(
          async (blob) => {
            const file = new File([blob] as BlobPart[], `${imgName}.jpg`)
            const uploadResponse = await fetch(
              `/api/image/upload?filename=${imgName}&teamId=${scopedTeamId}`,
              {
                method: 'POST',
                body: file,
                headers: new Headers({ 'content-type': mime })
              }
            ).then((res) => res.json())

            if (uploadResponse.success) {
              setShowTweetReady(true)
              setUploadReturnMessage(uploadResponse.message)
            }

            setLoadingUpload(false)
          },
          mime,
          1
        )
      })
      .catch(() => {
        setLoadingUpload(false)
      })
  }

  return (
    <ExtractImageContext.Provider
      value={{
        createImageAndSaveInBlobStore
      }}
    >
      {children}
      {loadingUpload ? (
        <Notification
          className="fixed bottom-2 right-2 max-w-xs"
          title="Estamos gerando o seu tweet"
          color="#7ae1bf"
          loading
        >
          Estamos gerando a imagem e isso pode demorar um instante...
        </Notification>
      ) : null}
      {showTweetReady && uploadReturnMessage ? (
        <Link
          href={`http://twitter.com/share?text=${uploadReturnMessage}&url=${
            URLS.cartolaStatisticsPage
          }/${HIGHLIGHT_TO_PARAM[highlight!]}/${teamId}&hashtags=estatisticasdocartola`}
          target="_blank"
          onClick={() => setShowTweetReady(false)}
        >
          <Notification
            className="fixed bottom-2 right-2 max-w-xs"
            title="O seu tweet está pronto!"
            icon={<IconBrandX size="1.1rem" />}
            color="dark"
          >
            <Flex>
              <Text>Clique aqui para compartilhar a sua estatística no twitter/X!</Text>
            </Flex>
          </Notification>
        </Link>
      ) : null}
    </ExtractImageContext.Provider>
  )
}

export function useExtractImageContext() {
  return useContext(ExtractImageContext)
}
