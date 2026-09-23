import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { CategoryRow } from './CategoryRow'
import type { Category } from '../../types'

interface CategorySectionProps {
  title: string
  tone: 'positive' | 'neutral'
  active: Category[]
  archived: Category[]
}

export function CategorySection({ title, tone, active, archived }: CategorySectionProps) {
  const [showArchived, setShowArchived] = useState(false)

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-brand-black">{title}</h2>
        <Badge tone={tone}>{active.length} active</Badge>
      </div>

      {active.length === 0 ? (
        <p className="text-sm text-neutral-500">No active categories yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {active.map((category) => (
            <CategoryRow key={category.id} category={category} />
          ))}
        </div>
      )}

      {archived.length > 0 && (
        <div className="border-t border-brand-border pt-3">
          <button
            type="button"
            onClick={() => setShowArchived((prev) => !prev)}
            className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-brand-black"
          >
            {showArchived ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            Archived ({archived.length})
          </button>

          {showArchived && (
            <div className="mt-3 flex flex-col gap-2">
              {archived.map((category) => (
                <CategoryRow key={category.id} category={category} />
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
