import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { MonthlySummary } from '../types'
import { getTransactionsForMonth } from './transactions'

function summaryDocRef(monthId: string) {
  return doc(db, 'monthlySummaries', monthId)
}

export async function getMonthlySummary(monthId: string): Promise<MonthlySummary | null> {
  const snap = await getDoc(summaryDocRef(monthId))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as MonthlySummary
}

export function subscribeToMonthlySummary(
  monthId: string,
  callback: (summary: MonthlySummary | null) => void,
  onError?: (error: Error) => void,
) {
  return onSnapshot(
    summaryDocRef(monthId),
    (snap) => {
      callback(snap.exists() ? ({ id: snap.id, ...snap.data() } as MonthlySummary) : null)
    },
    (error) => onError?.(error),
  )
}

export async function generateMonthlySummary(
  monthId: string,
  userId: string,
): Promise<MonthlySummary> {
  const [transactions, previous] = await Promise.all([
    getTransactionsForMonth(monthId),
    getPreviousMonthSummary(monthId),
  ])

  let totalInflow = 0
  let totalOutflow = 0
  const byCategory: Record<string, number> = {}

  for (const tx of transactions) {
    if (tx.type === 'inflow') {
      totalInflow += tx.amount
    } else {
      totalOutflow += tx.amount
    }
    byCategory[tx.category] = (byCategory[tx.category] ?? 0) + tx.amount
  }

  const summary: MonthlySummary = {
    id: monthId,
    totalInflow,
    totalOutflow,
    net: totalInflow - totalOutflow,
    byCategory,
    transactionCount: transactions.length,
    lastUpdated: Date.now(),
    generatedBy: userId,
    previousNet: previous?.net ?? null,
  }

  await setDoc(summaryDocRef(monthId), summary)
  return summary
}

async function getPreviousMonthSummary(monthId: string): Promise<MonthlySummary | null> {
  const [year, month] = monthId.split('-').map(Number)
  const prevDate = new Date(year, month - 2, 1)
  const prevId = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`
  return getMonthlySummary(prevId)
}
