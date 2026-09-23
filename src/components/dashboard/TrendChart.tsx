import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card } from '../ui/Card'
import { formatCurrency, formatMonthLabel } from '../../lib/format'

export interface TrendPoint {
  monthId: string
  inflow: number
  outflow: number
}

interface TrendChartProps {
  data: TrendPoint[]
}

export function TrendChart({ data }: TrendChartProps) {
  const chartData = data.map((point) => ({
    ...point,
    label: formatMonthLabel(point.monthId).replace(' 20', " '"),
  }))

  return (
    <Card>
      <h2 className="mb-4 text-base font-bold text-brand-black">Inflow vs Outflow — Last 6 Months</h2>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e4e1" />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#0a0a0a' }} />
            <YAxis
              tick={{ fontSize: 12, fill: '#0a0a0a' }}
              tickFormatter={(value: number) => formatCurrency(value)}
              width={90}
            />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value ?? 0))}
              contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: '#e2e4e1' }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="inflow" name="Inflow" fill="#16a34a" radius={[4, 4, 0, 0]} />
            <Bar dataKey="outflow" name="Outflow" fill="#0a0a0a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
