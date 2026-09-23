import { BarChart3 } from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { formatMonthLabel } from '../../lib/format'

interface SummaryEmptyStateProps {
  monthId: string
  generating: boolean
  onSummarize: () => void
}

export function SummaryEmptyState({ monthId, generating, onSummarize }: SummaryEmptyStateProps) {
  return (
    <Card className="flex flex-col items-center gap-4 py-12 text-center">
      <BarChart3 size={40} className="text-brand-green" />
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-brand-black">
          No summary yet for {formatMonthLabel(monthId)}
        </h3>
        <p className="text-sm text-neutral-500">
          Click Summarize Month to generate totals from this month&apos;s transactions.
        </p>
      </div>
      <Button onClick={onSummarize} disabled={generating}>
        {generating ? 'Summarizing…' : 'Summarize Month'}
      </Button>
    </Card>
  )
}
