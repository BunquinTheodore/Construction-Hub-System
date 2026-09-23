import { Select } from '../ui/Field'
import type { Category, TransactionType } from '../../types'

export interface TransactionFilterState {
  type: TransactionType | 'all'
  category: string
  startDate: string
  endDate: string
}

interface TransactionFiltersProps {
  categories: Category[]
  filters: TransactionFilterState
  onChange: (filters: TransactionFilterState) => void
}

export function TransactionFilters({ categories, filters, onChange }: TransactionFiltersProps) {
  const categoryOptions =
    filters.type === 'all' ? categories : categories.filter((c) => c.type === filters.type)

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="filter-type" className="text-xs font-semibold text-neutral-500">
          Type
        </label>
        <Select
          id="filter-type"
          value={filters.type}
          onChange={(e) =>
            onChange({ ...filters, type: e.target.value as TransactionFilterState['type'], category: '' })
          }
        >
          <option value="all">All Types</option>
          <option value="inflow">Inflow</option>
          <option value="outflow">Outflow</option>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="filter-category" className="text-xs font-semibold text-neutral-500">
          Category
        </label>
        <Select
          id="filter-category"
          value={filters.category}
          onChange={(e) => onChange({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          {categoryOptions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="filter-start" className="text-xs font-semibold text-neutral-500">
          From
        </label>
        <input
          id="filter-start"
          type="date"
          value={filters.startDate}
          onChange={(e) => onChange({ ...filters, startDate: e.target.value })}
          className="w-full rounded-lg border border-brand-border bg-white px-3 py-2.5 text-sm text-brand-black focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green-light"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="filter-end" className="text-xs font-semibold text-neutral-500">
          To
        </label>
        <input
          id="filter-end"
          type="date"
          value={filters.endDate}
          onChange={(e) => onChange({ ...filters, endDate: e.target.value })}
          className="w-full rounded-lg border border-brand-border bg-white px-3 py-2.5 text-sm text-brand-black focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green-light"
        />
      </div>
    </div>
  )
}
