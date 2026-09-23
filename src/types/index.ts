export type TransactionType = 'inflow' | 'outflow'

export interface Transaction {
  id: string
  amount: number
  type: TransactionType
  category: string
  date: string // ISO date string (yyyy-MM-dd)
  description?: string
  vendor?: string
  receiptUrl?: string
  receiptPath?: string
  createdBy: string
  createdByEmail?: string
  createdAt: number // epoch millis
}

export type NewTransaction = Omit<Transaction, 'id' | 'createdAt'>

export interface Category {
  id: string
  name: string
  type: TransactionType
  active: boolean
}

export type NewCategory = Omit<Category, 'id'>

export interface MonthlySummary {
  id: string // YYYY-MM
  totalInflow: number
  totalOutflow: number
  net: number
  byCategory: Record<string, number>
  transactionCount: number
  lastUpdated: number // epoch millis
  generatedBy: string
  previousNet?: number | null
}

export interface CategoryBreakdownEntry {
  categoryId: string
  categoryName: string
  amount: number
  percent: number
}
