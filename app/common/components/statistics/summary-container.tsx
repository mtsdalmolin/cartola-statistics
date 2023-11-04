import { ReactElement, useEffect, useRef } from 'react'

import { Flex } from '../flex'

export function SummaryContainer({
  children,
  title,
  id,
  focus
}: {
  children: ReactElement | ReactElement[]
  title: string
  id?: string
  focus?: boolean
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTimeout(() => {
      if (containerRef.current && focus) {
        containerRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    })
  }, [focus])

  return (
    <div
      ref={containerRef}
      id={id}
      className={`relative w-full rounded-md text-white bg-palette-neutral-900 h-fit p-4 ${
        focus ? 'shadow-lg shadow-palette-primary-500' : ''
      }`}
    >
      <div className="mt-[-0.175rem] mb-4">{title}</div>
      <Flex direction="column" gap="sm">
        {children}
      </Flex>
    </div>
  )
}
