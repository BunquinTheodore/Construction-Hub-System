import { ArrowDownCircle, ArrowUpCircle, Scale } from 'lucide-react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { formatCurrency } from '../../lib/format'

interface SnapshotCardsProps {
  totalInflow: number
  totalOutflow: number
  net: number
}

export function SnapshotCards({ totalInflow, totalOutflow, net }: SnapshotCardsProps) {
  const isHealthy = net >= 0

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-green-light">
          <ArrowUpCircle size={22} className="text-brand-green-dark" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-neutral-500">Total Inflow</span>
          <span className="text-xl font-bold text-brand-black">{formatCurrency(totalInflow)}</span>
        </div>
      </Card>

      <Card className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-gray">
          <ArrowDownCircle size={22} className="text-brand-black" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-neutral-500">Total Outflow</span>
          <span className="text-xl font-bold text-brand-black">{formatCurrency(totalOutflow)}</span>
        </div>
      </Card>

      <Card className="flex items-center gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
            isHealthy ? 'bg-brand-green-light' : 'bg-brand-red-light'
          }`}
        >
          <Scale size={22} className={isHealthy ? 'text-brand-green-dark' : 'text-brand-red'} />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <span className="text-sm font-medium text-neutral-500">Net</span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-brand-black">{formatCurrency(net)}</span>
            <Badge tone={isHealthy ? 'positive' : 'negative'}>
              {isHealthy ? 'Healthy' : 'Net Loss'}
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  )
}
