'use client'

import { ReactNode, createContext, useContext, useState } from 'react'

import Link from 'next/link'

import { HIGHLIGHT_TO_PARAM } from '@/app/constants/highlight'
import { enhanceImageStylePropsToGenerateStaticImage } from '@/app/helpers/image'
import { Notification, Text } from '@mantine/core'
import { IconBrandX, IconExternalLink, IconX } from '@tabler/icons-react'

import html2canvas from 'html2canvas'

import { Flex } from '../components/flex'
import { useShareStatisticsLinkContext } from './share-statistics-link-context.client'

interface BlobParamsToSave {
  element: HTMLElement
  imgName: string
  teamId: number
  roundId: number
}

const ExtractImageContext = createContext<{
  createImageAndSaveInBlobStore: ({ element, imgName, teamId }: BlobParamsToSave) => void
}>({ createImageAndSaveInBlobStore: () => {} })

export function ExtractImageContextProvider({ children }: { children: ReactNode }) {
  const [loadingUpload, setLoadingUpload] = useState(false)
  const [uploadReturnMessage, setUploadReturnMessage] = useState('')
  const [apiReturnedError, setApiReturnedError] = useState(false)
  const [showTweetReady, setShowTweetReady] = useState(false)
  const [highlight, setHighlight] = useState<string | null>(null)
  const { getShareLinkWithHighlight } = useShareStatisticsLinkContext()

  const createImageAndSaveInBlobStore = ({
    element,
    imgName,
    teamId,
    roundId
  }: BlobParamsToSave) => {
    setApiReturnedError(false)
    setLoadingUpload(true)
    setHighlight(imgName.split('_')[0])

    const mime = 'image/jpg'
    html2canvas(element, {
      onclone: enhanceImageStylePropsToGenerateStaticImage
    })
      .then((canvas) => {
        canvas.toBlob(
          async (blob) => {
            const file = new File([blob] as BlobPart[], `${imgName}.jpg`)
            const uploadResponse = await fetch(
              `/api/image/upload?filename=${imgName}&teamId=${teamId}&roundId=${roundId}`,
              {
                method: 'POST',
                body: file,
                headers: new Headers({ 'content-type': mime })
              }
            ).then((res) => res.json())

            if (uploadResponse.success) {
              setShowTweetReady(true)
              setUploadReturnMessage(uploadResponse.message)
            } else {
              setApiReturnedError(true)
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
          withCloseButton={false}
          loading
        >
          Estamos gerando a imagem e isso pode demorar um instante...
        </Notification>
      ) : null}
      {showTweetReady && uploadReturnMessage ? (
        <Link
          href={`http://twitter.com/intent/tweet?text=${uploadReturnMessage}%0A%0A&url=${getShareLinkWithHighlight(
            HIGHLIGHT_TO_PARAM[highlight!],
            true
          )}&hashtags=estatisticasdocartola`}
          target="_blank"
          onClick={() => setShowTweetReady(false)}
        >
          <Notification
            className="fixed bottom-2 right-2 max-w-xs"
            title={
              <Flex justify="between" align="center">
                <Text>O seu tweet está pronto!</Text>
                <IconExternalLink size={15} />
              </Flex>
            }
            icon={<IconBrandX size="1.1rem" aria-hidden />}
            color="dark"
            withCloseButton={false}
          >
            Clique aqui para compartilhar a sua estatística no twitter/X!
          </Notification>
        </Link>
      ) : null}
      {apiReturnedError ? (
        <Notification
          className="fixed bottom-2 right-2 max-w-xs"
          title="Aconteceu um erro inesperado!"
          icon={<IconX size="1.1rem" aria-hidden />}
          color="red"
          onClose={() => setApiReturnedError(false)}
        >
          Tente novamente mais tarde. Pode ser que algum dos nossos serviços esteja congestionado.
        </Notification>
      ) : null}
    </ExtractImageContext.Provider>
  )
}

export function useExtractImageContext() {
  return useContext(ExtractImageContext)
}
