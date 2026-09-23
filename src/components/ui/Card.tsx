import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ className = '', children, ...rest }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-brand-border bg-white p-5 shadow-sm ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
