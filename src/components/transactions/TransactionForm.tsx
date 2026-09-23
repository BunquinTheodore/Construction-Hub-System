import { useEffect, useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Input, LabelWrap, Select, Textarea } from '../ui/Field'
import type { Category, NewTransaction, Transaction, TransactionType } from '../../types'

interface TransactionFormProps {
  categories: Category[]
  editingTransaction: Transaction | null
  submitting: boolean
  onSubmit: (values: NewTransaction, file: File | null) => Promise<void>
  onCancel: () => void
}

interface FormErrors {
  amount?: string
  category?: string
  date?: string
  receipt?: string
}

const MAX_RECEIPT_SIZE_BYTES = 10 * 1024 * 1024
const ACCEPTED_RECEIPT_TYPES = /^image\/.*|application\/pdf$/

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

export function TransactionForm({
  categories,
  editingTransaction,
  submitting,
  onSubmit,
  onCancel,
}: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>('outflow')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [date, setDate] = useState(todayIso())
  const [description, setDescription] = useState('')
  const [vendor, setVendor] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type)
      setAmount(String(editingTransaction.amount))
      setCategoryId(editingTransaction.category)
      setDate(editingTransaction.date)
      setDescription(editingTransaction.description ?? '')
      setVendor(editingTransaction.vendor ?? '')
      setFile(null)
      setErrors({})
    }
  }, [editingTransaction])

  const activeCategoriesForType = categories.filter((c) => {
    if (c.type !== type) return false
    if (c.active) return true
    // Keep the currently-selected category visible even if it has since been
    // archived, so editing an existing transaction doesn't silently orphan it.
    return c.id === categoryId
  })

  function handleTypeChange(next: TransactionType) {
    setType(next)
    setCategoryId('')
  }

  function handleFileChange(selected: File | null) {
    if (!selected) {
      setFile(null)
      setErrors((prev) => ({ ...prev, receipt: undefined }))
      return
    }
    if (!ACCEPTED_RECEIPT_TYPES.test(selected.type)) {
      setFile(null)
      setErrors((prev) => ({ ...prev, receipt: 'Only image or PDF receipts are allowed.' }))
      return
    }
    if (selected.size > MAX_RECEIPT_SIZE_BYTES) {
      setFile(null)
      setErrors((prev) => ({ ...prev, receipt: 'Receipt file must be smaller than 10MB.' }))
      return
    }
    setFile(selected)
    setErrors((prev) => ({ ...prev, receipt: undefined }))
  }

  function validate(): FormErrors {
    const nextErrors: FormErrors = {}
    const numericAmount = Number(amount)
    if (!amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      nextErrors.amount = 'Enter an amount greater than zero.'
    }
    if (!categoryId) {
      nextErrors.category = 'Select a category.'
    }
    if (!date) {
      nextErrors.date = 'Select a date.'
    }
    return nextErrors
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const nextErrors = validate()
    setErrors((prev) => ({ ...nextErrors, receipt: prev.receipt }))
    if (Object.keys(nextErrors).length > 0 || errors.receipt) return

    await onSubmit(
      {
        amount: Number(amount),
        type,
        category: categoryId,
        date,
        description: description.trim() || undefined,
        vendor: vendor.trim() || undefined,
        createdBy: editingTransaction?.createdBy ?? '',
        createdByEmail: editingTransaction?.createdByEmail,
      },
      file,
    )
  }

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-brand-black">
          {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg p-1.5 text-neutral-400 hover:bg-brand-gray hover:text-brand-black cursor-pointer"
          aria-label="Close form"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleTypeChange('inflow')}
            className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer ${
              type === 'inflow'
                ? 'border-brand-green bg-brand-green-light text-brand-green-dark'
                : 'border-brand-border bg-white text-brand-black hover:bg-brand-gray'
            }`}
          >
            Inflow
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('outflow')}
            className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer ${
              type === 'outflow'
                ? 'border-brand-black bg-brand-black text-white'
                : 'border-brand-border bg-white text-brand-black hover:bg-brand-gray'
            }`}
          >
            Outflow
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <LabelWrap label="Amount (PHP)" htmlFor="amount" required error={errors.amount}>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </LabelWrap>

          <LabelWrap label="Category" htmlFor="category" required error={errors.category}>
            <Select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Select category</option>
              {activeCategoriesForType.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </LabelWrap>

          <LabelWrap label="Date" htmlFor="date" required error={errors.date}>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </LabelWrap>

          <LabelWrap label="Vendor / Source" htmlFor="vendor">
            <Input
              id="vendor"
              type="text"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              placeholder="e.g. ABC Hardware"
            />
          </LabelWrap>
        </div>

        <LabelWrap label="Description / Notes" htmlFor="description">
          <Textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional notes about this transaction"
          />
        </LabelWrap>

        <LabelWrap label="Receipt" htmlFor="receipt" error={errors.receipt}>
          <input
            id="receipt"
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
            className="w-full rounded-lg border border-brand-border bg-white px-3 py-2.5 text-sm text-brand-black file:mr-3 file:rounded-md file:border-0 file:bg-brand-green-light file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-brand-green-dark"
          />
          {editingTransaction?.receiptUrl && !file && (
            <span className="text-xs text-neutral-500">
              Existing receipt attached. Choose a new file to replace it.
            </span>
          )}
        </LabelWrap>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : editingTransaction ? 'Save Changes' : 'Add Transaction'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
