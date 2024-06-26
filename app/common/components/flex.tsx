import { ReactElement, ReactNode, Ref, forwardRef } from 'react'

import { VariantProps, tv } from 'tailwind-variants'

const flexContainer = tv({
  base: ['flex', 'flex-wrap', 'grow'],
  variants: {
    justify: {
      start: 'justify-start',
      end: 'justify-end',
      center: 'justify-center',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
      stretch: 'justify-stretch'
    },
    align: {
      start: 'items-start',
      end: 'items-end',
      center: 'items-center',
      baseline: 'items-baseline',
      stretch: 'items-stretch'
    },
    direction: {
      row: '',
      column: 'flex-col'
    },
    gap: {
      xs: 'gap-2',
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8',
      xl: 'gap-16',
      none: 'gap-0'
    }
  },
  defaultVariants: {
    justify: 'start',
    align: 'start',
    direction: 'row',
    gap: 'xs'
  }
})

type FlexChildren = ReactElement | ReactNode | string

function FlexComponent(
  {
    children,
    className,
    ...props
  }: {
    children: FlexChildren[] | FlexChildren
    className?: string
  } & VariantProps<typeof flexContainer>,
  ref: Ref<HTMLDivElement>
) {
  return (
    <div ref={ref} className={flexContainer({ ...props, className: className ?? '' })} {...props}>
      {children}
    </div>
  )
}

export const Flex = forwardRef(FlexComponent)
