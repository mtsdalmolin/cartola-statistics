import { ReactNode, useEffect, useRef } from 'react'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'

import { Bebas_Neue } from 'next/font/google'

const bebasNeue = Bebas_Neue({ weight: '400', subsets: ['latin'] })

export function StatisticsSection({
  children,
  title,
  apiHasEndedRequestsAndReturnedData
}: {
  children: ReactNode
  title: string
  apiHasEndedRequestsAndReturnedData?: boolean
}) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (apiHasEndedRequestsAndReturnedData) {
      sectionRef.current?.scrollIntoView({
        behavior: 'smooth'
      })
    }
  }, [apiHasEndedRequestsAndReturnedData])

  return (
    <section ref={sectionRef}>
      <h2 className={`${bebasNeue.className} py-2 text-7xl text-palette-primary-500`}>{title}</h2>
      <article>
        <ResponsiveMasonry columnsCountBreakPoints={{ 375: 1, 575: 2, 920: 3 }}>
          <Masonry gutter="1rem" columnsCount={3}>
            {children}
          </Masonry>
        </ResponsiveMasonry>
      </article>
    </section>
  )
}
