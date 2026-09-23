import { Card } from '../ui/Card'
import { formatCurrency } from '../../lib/format'
import type { Category, CategoryBreakdownEntry, TransactionType } from '../../types'

interface CategoryBreakdownListProps {
  title: string
  type: TransactionType
  byCategory: Record<string, number>
  categoriesById: Map<string, Category>
  total: number
  barColorClass: string
}

function buildEntries(
  byCategory: Record<string, number>,
  categoriesById: Map<string, Category>,
  type: TransactionType,
  total: number,
): CategoryBreakdownEntry[] {
  const entries: CategoryBreakdownEntry[] = []

  for (const [categoryId, amount] of Object.entries(byCategory)) {
    const category = categoriesById.get(categoryId)
    if (category && category.type !== type) continue
    entries.push({
      categoryId,
      categoryName: category?.name ?? 'Uncategorized',
      amount,
      percent: total > 0 ? (amount / total) * 100 : 0,
    })
  }

  return entries.sort((a, b) => b.amount - a.amount)
}

export function CategoryBreakdownList({
  title,
  type,
  byCategory,
  categoriesById,
  total,
  barColorClass,
}: CategoryBreakdownListProps) {
  const entries = buildEntries(byCategory, categoriesById, type, total)

  return (
    <Card className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-brand-black">{title}</h3>
      {entries.length === 0 ? (
        <p className="text-sm text-neutral-500">No {type} transactions recorded this month.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {entries.map((entry) => (
            <li key={entry.categoryId} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-brand-black">{entry.categoryName}</span>
                <span className="text-neutral-500">
                  {formatCurrency(entry.amount)} · {Math.round(entry.percent)}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-brand-gray">
                <div
                  className={`h-full rounded-full ${barColorClass}`}
                  style={{ width: `${Math.min(100, entry.percent)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
