import { useEffect, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { TransactionForm } from '../components/transactions/TransactionForm'
import { TransactionFilters, type TransactionFilterState } from '../components/transactions/TransactionFilters'
import { TransactionList } from '../components/transactions/TransactionList'
import { useAuth } from '../context/AuthContext'
import { subscribeToCategories } from '../services/categories'
import { subscribeToTransactions, createTransaction, updateTransaction, deleteTransaction } from '../services/transactions'
import { uploadReceipt } from '../services/storage'
import type { Category, NewTransaction, Transaction } from '../types'

const emptyFilters: TransactionFilterState = {
  type: 'all',
  category: '',
  startDate: '',
  endDate: '',
}

export function TransactionsPage() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [transactionsLoading, setTransactionsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [loadError, setLoadError] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [filters, setFilters] = useState<TransactionFilterState>(emptyFilters)

  useEffect(() => {
    const unsubscribe = subscribeToTransactions(
      (data) => {
        setTransactions(data)
        setTransactionsLoading(false)
      },
      (error) => {
        setLoadError(error.message || 'Failed to load transactions.')
        setTransactionsLoading(false)
      },
    )
    return unsubscribe
  }, [])

  useEffect(() => {
    const unsubscribe = subscribeToCategories(setCategories, (error) => {
      setLoadError(error.message || 'Failed to load categories.')
    })
    return unsubscribe
  }, [])

  const categoryNameById = useMemo(() => {
    const map = new Map<string, string>()
    categories.forEach((c) => map.set(c.id, c.name))
    return map
  }, [categories])

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (filters.type !== 'all' && t.type !== filters.type) return false
      if (filters.category && t.category !== filters.category) return false
      if (filters.startDate && t.date < filters.startDate) return false
      if (filters.endDate && t.date > filters.endDate) return false
      return true
    })
  }, [transactions, filters])

  function openAddForm() {
    setEditingTransaction(null)
    setSubmitError('')
    setShowForm(true)
  }

  function openEditForm(transaction: Transaction) {
    setEditingTransaction(transaction)
    setSubmitError('')
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingTransaction(null)
    setSubmitError('')
  }

  async function handleSubmit(values: NewTransaction, file: File | null) {
    if (!user) {
      setSubmitError('You must be signed in to save transactions.')
      return
    }

    setSubmitting(true)
    setSubmitError('')
    try {
      let receiptUrl = editingTransaction?.receiptUrl
      let receiptPath = editingTransaction?.receiptPath

      if (file) {
        const uploaded = await uploadReceipt(file, user.uid)
        receiptUrl = uploaded.url
        receiptPath = uploaded.path
      }

      const payload: NewTransaction = {
        ...values,
        receiptUrl,
        receiptPath,
        createdBy: editingTransaction?.createdBy ?? user.uid,
        createdByEmail: editingTransaction?.createdByEmail ?? user.email ?? undefined,
      }

      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, payload)
      } else {
        await createTransaction(payload)
      }

      closeForm()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to save transaction.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    setDeleteError('')
    try {
      await deleteTransaction(id)
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete transaction.')
      throw err
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-brand-black">Transactions</h1>
          <p className="text-sm text-neutral-500">Track every inflow and outflow for Construction Hub PH.</p>
        </div>
        {!showForm && (
          <Button onClick={openAddForm}>
            <Plus size={16} />
            Add Transaction
          </Button>
        )}
      </div>

      {loadError && (
        <Card className="border-brand-red bg-brand-red-light">
          <p className="text-sm font-medium text-brand-red">{loadError}</p>
        </Card>
      )}

      {deleteError && (
        <Card className="border-brand-red bg-brand-red-light">
          <p className="text-sm font-medium text-brand-red">{deleteError}</p>
        </Card>
      )}

      {showForm && (
        <div className="flex flex-col gap-2">
          <TransactionForm
            categories={categories}
            editingTransaction={editingTransaction}
            submitting={submitting}
            onSubmit={handleSubmit}
            onCancel={closeForm}
          />
          {submitError && <p className="text-sm font-medium text-brand-red">{submitError}</p>}
        </div>
      )}

      <Card>
        <TransactionFilters categories={categories} filters={filters} onChange={setFilters} />
      </Card>

      <Card>
        <TransactionList
          transactions={filteredTransactions}
          loading={transactionsLoading}
          categoryNameById={categoryNameById}
          onEdit={openEditForm}
          onDelete={handleDelete}
        />
      </Card>
    </div>
  )
}
