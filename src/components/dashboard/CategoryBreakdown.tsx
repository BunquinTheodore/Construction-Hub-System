import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card } from '../ui/Card'
import { formatCurrency } from '../../lib/format'
import type { CategoryBreakdownEntry } from '../../types'

interface CategoryBreakdownProps {
  entries: CategoryBreakdownEntry[]
}

const COLORS = ['#16a34a', '#0f7a37', '#0a0a0a', '#4b5563', '#86efac', '#9ca3af', '#065f46', '#1f2937']

export function CategoryBreakdown({ entries }: CategoryBreakdownProps) {
  const hasData = entries.length > 0

  return (
    <Card>
      <h2 className="mb-4 text-base font-bold text-brand-black">Spending by Category — This Month</h2>
      {!hasData ? (
        <div className="flex h-56 items-center justify-center text-sm text-neutral-500">
          No categorized activity yet this month.
        </div>
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="h-56 w-full sm:w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={entries}
                  dataKey="amount"
                  nameKey="categoryName"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {entries.map((entry, index) => (
                    <Cell key={entry.categoryId} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value ?? 0))}
                  contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: '#e2e4e1' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="flex flex-1 flex-col gap-2">
            {entries.map((entry, index) => (
              <li key={entry.categoryId} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 text-brand-black">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  {entry.categoryName}
                </span>
                <span className="font-semibold text-brand-black">{formatCurrency(entry.amount)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}
