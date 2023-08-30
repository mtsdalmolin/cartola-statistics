import { ReactElement } from 'react'

interface ButtonProps {
  children: string | ReactElement
  onClick: () => void
}

export function Button({
  children,
  onClick,
  ...props
}: ButtonProps) {
  return (
    <button
      className="bg-sky-600 text-cyan-50 py-2 px-4 rounded-md hover:opacity-95"
      onClick={onClick}
      {...props}
    >{children}</button>
  )
}