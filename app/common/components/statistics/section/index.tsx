import { ReactNode } from 'react'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'

import { bebasNeue } from '@/app/common/fonts/bebasNeue'

export function StatisticsSection({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="py-12 w-full text-left">
      <h2 className={`${bebasNeue.className} py-2 text-7xl text-palette-primary-500`}>{title}</h2>
      <article>
        <ResponsiveMasonry columnsCountBreakPoints={{ 375: 1, 575: 2, 920: 3 }}>
          <Masonry gutter="1rem">{children}</Masonry>
        </ResponsiveMasonry>
      </article>
    </section>
  )
}
