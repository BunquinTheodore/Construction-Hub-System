import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

const baseInputClasses =
  'w-full rounded-lg border border-brand-border bg-white px-3 py-2.5 text-sm text-brand-black placeholder:text-neutral-400 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green-light disabled:opacity-50'

interface LabelWrapProps {
  label: string
  htmlFor: string
  required?: boolean
  error?: string
  children: ReactNode
}

export function LabelWrap({ label, htmlFor, required, error, children }: LabelWrapProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-brand-black">
        {label}
        {required && <span className="text-brand-red"> *</span>}
      </label>
      {children}
      {error && <span className="text-xs font-medium text-brand-red">{error}</span>}
    </div>
  )
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${baseInputClasses} ${props.className ?? ''}`} />
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${baseInputClasses} ${props.className ?? ''}`} />
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${baseInputClasses} ${props.className ?? ''}`} />
}
