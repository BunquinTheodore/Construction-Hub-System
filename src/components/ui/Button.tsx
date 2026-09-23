import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-brand-green text-white hover:bg-brand-green-dark disabled:opacity-50',
  secondary:
    'bg-white text-brand-black border border-brand-border hover:bg-brand-gray disabled:opacity-50',
  danger: 'bg-brand-red text-white hover:opacity-90 disabled:opacity-50',
  ghost: 'bg-transparent text-brand-black hover:bg-brand-gray disabled:opacity-50',
}

export function Button({ variant = 'primary', className = '', children, ...rest }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
