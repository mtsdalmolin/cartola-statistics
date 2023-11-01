'use client'

import { ReactNode, createContext, useContext, useState } from 'react'

import { Notification } from '@mantine/core'

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

  const createImageAndSaveInBlobStore = ({ element, imgName, teamId }: BlobParamsToSave) => {
    setLoadingUpload(true)
    const mime = 'image/jpg'
    html2canvas(element)
      .then((canvas) => {
        canvas.toBlob(
          async (blob) => {
            const file = new File([blob] as BlobPart[], `${imgName}.jpg`)
            await fetch(`/api/image/upload?filename=${imgName}&teamId=${teamId}`, {
              method: 'POST',
              body: file,
              headers: new Headers({ 'content-type': mime })
            }).then((res) => res.json())
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
          title="Salvando imagem da estatística"
          color="#7ae1bf"
          loading
        >
          Estamos gerando a imagem e isso pode demorar um instante...
        </Notification>
      ) : null}
    </ExtractImageContext.Provider>
  )
}

export function useExtractImageContext() {
  return useContext(ExtractImageContext)
}
