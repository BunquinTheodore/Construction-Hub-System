import { Link } from 'react-router-dom'
import { Paperclip } from 'lucide-react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { formatCurrency, formatDateShort } from '../../lib/format'
import type { Transaction } from '../../types'

interface RecentTransactionsProps {
  transactions: Transaction[]
  categoryNameById: Map<string, string>
}

export function RecentTransactions({ transactions, categoryNameById }: RecentTransactionsProps) {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-brand-black">Recent Transactions</h2>
        <Link to="/transactions" className="text-sm font-semibold text-brand-green hover:underline">
          View all
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <p className="text-sm text-neutral-500">No transactions yet — add your first receipt.</p>
          <Link
            to="/transactions"
            className="text-sm font-semibold text-brand-green hover:underline"
          >
            Go to Transactions
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-brand-border text-left text-neutral-500">
                <th className="py-2 pr-3 font-medium">Date</th>
                <th className="py-2 pr-3 font-medium">Vendor / Description</th>
                <th className="py-2 pr-3 font-medium">Category</th>
                <th className="py-2 pr-3 font-medium text-right">Amount</th>
                <th className="py-2 pl-3 font-medium text-center">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-brand-border last:border-0">
                  <td className="py-2.5 pr-3 whitespace-nowrap text-brand-black">
                    {formatDateShort(tx.date)}
                  </td>
                  <td className="py-2.5 pr-3 text-brand-black">
                    {tx.vendor || tx.description || '—'}
                  </td>
                  <td className="py-2.5 pr-3">
                    <Badge tone="neutral">{categoryNameById.get(tx.category) ?? 'Uncategorized'}</Badge>
                  </td>
                  <td
                    className={`py-2.5 pr-3 text-right font-semibold whitespace-nowrap ${
                      tx.type === 'inflow' ? 'text-brand-green-dark' : 'text-brand-black'
                    }`}
                  >
                    {tx.type === 'inflow' ? '+' : '-'}
                    {formatCurrency(tx.amount)}
                  </td>
                  <td className="py-2.5 pl-3 text-center">
                    {tx.receiptUrl ? (
                      <a
                        href={tx.receiptUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center text-brand-green hover:text-brand-green-dark"
                        aria-label="View receipt"
                      >
                        <Paperclip size={16} />
                      </a>
                    ) : (
                      <span className="text-neutral-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
