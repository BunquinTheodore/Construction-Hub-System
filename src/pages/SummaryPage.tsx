import { useEffect, useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { subscribeToCategories } from '../services/categories'
import { subscribeToMonthlySummary, generateMonthlySummary } from '../services/summaries'
import { currentMonthId, formatMonthLabel } from '../lib/format'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input, LabelWrap } from '../components/ui/Field'
import { SummaryStatCards } from '../components/summary/SummaryStatCards'
import { CategoryBreakdownList } from '../components/summary/CategoryBreakdownList'
import { SummaryEmptyState } from '../components/summary/SummaryEmptyState'
import type { Category, MonthlySummary } from '../types'

const lastUpdatedFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function SummaryPage() {
  const { user } = useAuth()
  const [monthId, setMonthId] = useState(currentMonthId())
  const [summary, setSummary] = useState<MonthlySummary | null>(null)
  const [summaryLoaded, setSummaryLoaded] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    return subscribeToCategories(setCategories, (err) => {
      setLoadError(err.message || 'Failed to load categories.')
    })
  }, [])

  useEffect(() => {
    setSummaryLoaded(false)
    const unsubscribe = subscribeToMonthlySummary(
      monthId,
      (value) => {
        setSummary(value)
        setSummaryLoaded(true)
      },
      (err) => {
        setLoadError(err.message || 'Failed to load monthly summary.')
        setSummaryLoaded(true)
      },
    )
    return unsubscribe
  }, [monthId])

  const categoriesById = useMemo(() => {
    return new Map(categories.map((category) => [category.id, category]))
  }, [categories])

  async function handleSummarize() {
    if (!user) return
    setError('')
    setGenerating(true)
    try {
      await generateMonthlySummary(monthId, user.uid)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate summary. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-brand-black">Monthly Summary</h1>
          <p className="text-sm text-neutral-500">
            Review income, expenses, and category breakdown for a given month.
          </p>
        </div>

        <div className="flex items-end gap-3">
          <LabelWrap label="Month" htmlFor="month-picker">
            <Input
              id="month-picker"
              type="month"
              value={monthId}
              onChange={(e) => setMonthId(e.target.value)}
              className="w-44"
            />
          </LabelWrap>
          <Button onClick={handleSummarize} disabled={generating || !user}>
            <RefreshCw size={16} className={generating ? 'animate-spin' : ''} />
            {generating ? 'Summarizing…' : 'Summarize Month'}
          </Button>
        </div>
      </div>

      {loadError && (
        <Card className="border-brand-red bg-brand-red-light">
          <p className="text-sm font-medium text-brand-red">{loadError}</p>
        </Card>
      )}

      {error && (
        <Card className="border-brand-red bg-brand-red-light">
          <p className="text-sm font-medium text-brand-red">{error}</p>
        </Card>
      )}

      {!summaryLoaded ? (
        <Card className="py-12 text-center">
          <p className="text-sm text-neutral-500">Loading summary…</p>
        </Card>
      ) : !summary ? (
        <SummaryEmptyState monthId={monthId} generating={generating} onSummarize={handleSummarize} />
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Summary for <span className="font-semibold text-brand-black">{formatMonthLabel(monthId)}</span>
              {' · '}
              {summary.transactionCount} transaction{summary.transactionCount === 1 ? '' : 's'}
            </span>
            <span>Last updated: {lastUpdatedFormatter.format(new Date(summary.lastUpdated))}</span>
          </div>

          <SummaryStatCards summary={summary} />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <CategoryBreakdownList
              title="Inflow by Category"
              type="inflow"
              byCategory={summary.byCategory}
              categoriesById={categoriesById}
              total={summary.totalInflow}
              barColorClass="bg-brand-green"
            />
            <CategoryBreakdownList
              title="Outflow by Category"
              type="outflow"
              byCategory={summary.byCategory}
              categoriesById={categoriesById}
              total={summary.totalOutflow}
              barColorClass="bg-brand-black"
            />
          </div>
        </div>
      )}
    </div>
  )
}
