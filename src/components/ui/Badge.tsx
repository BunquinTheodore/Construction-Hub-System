import type { ReactNode } from 'react'

type Tone = 'positive' | 'negative' | 'neutral'

const toneClasses: Record<Tone, string> = {
  positive: 'bg-brand-green-light text-brand-green-dark',
  negative: 'bg-brand-red-light text-brand-red',
  neutral: 'bg-brand-gray text-brand-black',
}

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[tone]}`}
    >
      {children}
    </span>
  )
}
