import { useState } from 'react'
import { Paperclip, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { formatCurrency, formatDateShort } from '../../lib/format'
import type { Transaction } from '../../types'

interface TransactionRowProps {
  transaction: Transaction
  categoryName: string
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => Promise<void>
}

export function TransactionRow({ transaction, categoryName, onEdit, onDelete }: TransactionRowProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const isInflow = transaction.type === 'inflow'

  async function handleConfirmDelete() {
    setDeleting(true)
    setDeleteError('')
    try {
      await onDelete(transaction.id)
      setConfirmingDelete(false)
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete transaction.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 border-b border-brand-border py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={isInflow ? 'positive' : 'neutral'}>{isInflow ? 'Inflow' : 'Outflow'}</Badge>
          <Badge tone="neutral">{categoryName}</Badge>
          <span className="text-xs font-medium text-neutral-500">{formatDateShort(transaction.date)}</span>
        </div>
        <div className="text-sm font-semibold text-brand-black">
          {transaction.vendor || 'No vendor specified'}
        </div>
        {transaction.description && (
          <p className="text-sm text-neutral-500">{transaction.description}</p>
        )}
        {transaction.receiptUrl && (
          <a
            href={transaction.receiptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-brand-green hover:underline"
          >
            <Paperclip size={14} />
            View receipt
          </a>
        )}
      </div>

      <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
        <span className={`text-base font-bold ${isInflow ? 'text-brand-green-dark' : 'text-brand-black'}`}>
          {isInflow ? '+' : '-'}
          {formatCurrency(transaction.amount)}
        </span>

        {confirmingDelete ? (
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-brand-black">Delete this entry?</span>
              <Button
                variant="danger"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-3 py-1.5 text-xs"
              >
                {deleting ? 'Deleting...' : 'Confirm'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setConfirmingDelete(false)
                  setDeleteError('')
                }}
                disabled={deleting}
                className="px-3 py-1.5 text-xs"
              >
                Cancel
              </Button>
            </div>
            {deleteError && <span className="text-xs font-medium text-brand-red">{deleteError}</span>}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(transaction)}
              className="rounded-lg p-2 text-neutral-500 hover:bg-brand-gray hover:text-brand-black cursor-pointer"
              aria-label="Edit transaction"
            >
              <Pencil size={16} />
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="rounded-lg p-2 text-neutral-500 hover:bg-brand-red-light hover:text-brand-red cursor-pointer"
              aria-label="Delete transaction"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
