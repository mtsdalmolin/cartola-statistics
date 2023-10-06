import { ReactElement } from 'react'

export function SummaryContainer({
  children,
  title
}: {
  children: ReactElement | ReactElement[]
  title: string
}) {
  return (
    <div className="w-full rounded-md text-white bg-zinc-900 p-4">
      <div className="mt-[-0.175rem] mb-4">{title}</div>
      <div className="flex flex-col gap-x-4 gap-y-12">{children}</div>
    </div>
  )
}
