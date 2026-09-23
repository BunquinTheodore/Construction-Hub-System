import { TransactionRow } from './TransactionRow'
import type { Transaction } from '../../types'

interface TransactionListProps {
  transactions: Transaction[]
  loading: boolean
  categoryNameById: Map<string, string>
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => Promise<void>
}

export function TransactionList({
  transactions,
  loading,
  categoryNameById,
  onEdit,
  onDelete,
}: TransactionListProps) {
  if (loading) {
    return <p className="py-10 text-center text-sm text-neutral-500">Loading transactions...</p>
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-1 py-10 text-center">
        <p className="text-sm font-semibold text-brand-black">No transactions found</p>
        <p className="text-sm text-neutral-500">Try adjusting your filters or add a new transaction.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {transactions.map((transaction) => (
        <TransactionRow
          key={transaction.id}
          transaction={transaction}
          categoryName={categoryNameById.get(transaction.category) ?? 'Uncategorized'}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
