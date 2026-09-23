import { ArrowDownCircle, ArrowUpCircle, TrendingDown, TrendingUp } from 'lucide-react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { formatCurrency } from '../../lib/format'
import type { MonthlySummary } from '../../types'

interface SummaryStatCardsProps {
  summary: MonthlySummary
}

function computeChange(net: number, previousNet?: number | null) {
  if (previousNet === null || previousNet === undefined) return null
  if (previousNet === 0) {
    return net === 0 ? { label: 'No change vs last month', positive: true } : null
  }
  const percent = ((net - previousNet) / Math.abs(previousNet)) * 100
  const positive = percent >= 0
  const rounded = Math.abs(Math.round(percent))
  return {
    label: positive
      ? `+${rounded}% vs last month`
      : `Net decreased ${rounded}% vs last month`,
    positive,
  }
}

export function SummaryStatCards({ summary }: SummaryStatCardsProps) {
  const isLoss = summary.net < 0
  const change = computeChange(summary.net, summary.previousNet)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-brand-green">
          <ArrowUpCircle size={18} />
          <span className="text-sm font-medium text-neutral-500">Total Inflow</span>
        </div>
        <span className="text-2xl font-bold text-brand-black">
          {formatCurrency(summary.totalInflow)}
        </span>
      </Card>

      <Card className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-brand-black">
          <ArrowDownCircle size={18} />
          <span className="text-sm font-medium text-neutral-500">Total Outflow</span>
        </div>
        <span className="text-2xl font-bold text-brand-black">
          {formatCurrency(summary.totalOutflow)}
        </span>
      </Card>

      <Card className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-neutral-500">
            {isLoss ? <TrendingDown size={18} className="text-brand-red" /> : <TrendingUp size={18} className="text-brand-green" />}
            <span className="text-sm font-medium">Net</span>
          </div>
          {isLoss && <Badge tone="negative">Net Loss</Badge>}
        </div>
        <span className={`text-2xl font-bold ${isLoss ? 'text-brand-red' : 'text-brand-green-dark'}`}>
          {formatCurrency(summary.net)}
        </span>
        {change && (
          <span className={`text-sm font-medium ${change.positive ? 'text-brand-green-dark' : 'text-brand-red'}`}>
            {change.label}
          </span>
        )}
      </Card>
    </div>
  )
}
