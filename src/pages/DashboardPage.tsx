import { useEffect, useMemo, useState } from 'react'
import { subscribeToTransactions } from '../services/transactions'
import { subscribeToCategories } from '../services/categories'
import { currentMonthId, lastNMonthIds } from '../lib/format'
import { SnapshotCards } from '../components/dashboard/SnapshotCards'
import { TrendChart, type TrendPoint } from '../components/dashboard/TrendChart'
import { CategoryBreakdown } from '../components/dashboard/CategoryBreakdown'
import { RecentTransactions } from '../components/dashboard/RecentTransactions'
import type { Category, CategoryBreakdownEntry, Transaction } from '../types'

const RECENT_TRANSACTIONS_LIMIT = 10
const TREND_MONTHS_COUNT = 6

function monthPrefix(dateStr: string): string {
  return dateStr.slice(0, 7)
}

export function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    const unsubscribeTransactions = subscribeToTransactions(
      (data) => {
        setTransactions(data)
        setLoading(false)
      },
      (error) => {
        setLoadError(error.message || 'Failed to load transactions.')
        setLoading(false)
      },
    )
    const unsubscribeCategories = subscribeToCategories(setCategories, (error) => {
      setLoadError(error.message || 'Failed to load categories.')
    })

    return () => {
      unsubscribeTransactions()
      unsubscribeCategories()
    }
  }, [])

  const categoryNameById = useMemo(() => {
    const map = new Map<string, string>()
    for (const category of categories) {
      map.set(category.id, category.name)
    }
    return map
  }, [categories])

  const monthId = currentMonthId()

  const currentMonthTransactions = useMemo(
    () => transactions.filter((tx) => monthPrefix(tx.date) === monthId),
    [transactions, monthId],
  )

  const { totalInflow, totalOutflow } = useMemo(() => {
    return currentMonthTransactions.reduce(
      (acc, tx) => {
        if (tx.type === 'inflow') {
          acc.totalInflow += tx.amount
        } else {
          acc.totalOutflow += tx.amount
        }
        return acc
      },
      { totalInflow: 0, totalOutflow: 0 },
    )
  }, [currentMonthTransactions])

  const net = totalInflow - totalOutflow

  const trendData = useMemo<TrendPoint[]>(() => {
    const months = lastNMonthIds(TREND_MONTHS_COUNT)
    const buckets = new Map<string, { inflow: number; outflow: number }>()
    for (const id of months) {
      buckets.set(id, { inflow: 0, outflow: 0 })
    }

    for (const tx of transactions) {
      const bucket = buckets.get(monthPrefix(tx.date))
      if (!bucket) continue
      if (tx.type === 'inflow') {
        bucket.inflow += tx.amount
      } else {
        bucket.outflow += tx.amount
      }
    }

    return months.map((id) => ({ monthId: id, ...buckets.get(id)! }))
  }, [transactions])

  const categoryBreakdown = useMemo<CategoryBreakdownEntry[]>(() => {
    const totals = new Map<string, number>()
    for (const tx of currentMonthTransactions) {
      if (tx.type !== 'outflow') continue
      totals.set(tx.category, (totals.get(tx.category) ?? 0) + tx.amount)
    }

    const grandTotal = Array.from(totals.values()).reduce((sum, value) => sum + value, 0)

    return Array.from(totals.entries())
      .map(([categoryId, amount]) => ({
        categoryId,
        categoryName: categoryNameById.get(categoryId) ?? 'Uncategorized',
        amount,
        percent: grandTotal > 0 ? (amount / grandTotal) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
  }, [currentMonthTransactions, categoryNameById])

  const recentTransactions = transactions.slice(0, RECENT_TRANSACTIONS_LIMIT)

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-neutral-500">
        Loading dashboard…
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-black">Dashboard</h1>
        <p className="text-sm text-neutral-500">Overview for the current month at a glance.</p>
      </div>

      {loadError && (
        <div className="rounded-lg border border-brand-red bg-brand-red-light px-4 py-3">
          <p className="text-sm font-medium text-brand-red">{loadError}</p>
        </div>
      )}

      <SnapshotCards totalInflow={totalInflow} totalOutflow={totalOutflow} net={net} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TrendChart data={trendData} />
        </div>
        <CategoryBreakdown entries={categoryBreakdown} />
      </div>

      <RecentTransactions transactions={recentTransactions} categoryNameById={categoryNameById} />
    </div>
  )
}
