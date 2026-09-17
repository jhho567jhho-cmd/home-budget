'use client'

interface ChartData {
  category: string
  amount: number
  percentage: number
}

interface StatsChartProps {
  data: ChartData[]
  title?: string
}

export function StatsChart({ data, title = 'הוצאות לפי קטגוריה' }: StatsChartProps) {
  const maxAmount = Math.max(...data.map((d) => d.amount), 1)
  const colors = [
    '#6366f1', // indigo
    '#a855f7', // purple
    '#ec4899', // pink
    '#f59e0b', // amber
    '#10b981', // emerald
    '#06b6d4', // cyan
    '#8b5cf6', // violet
    '#ef4444', // red
  ]

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
      <h3 className="font-semibold text-gray-200 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">אין נתונים להצגה</p>
        ) : (
          data.map((item, idx) => (
            <div key={item.category} className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-300">{item.category}</span>
                <span className="font-semibold">₪{item.amount.toFixed(2)}</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(item.amount / maxAmount) * 100}%`,
                    backgroundColor: colors[idx % colors.length],
                  }}
                />
              </div>
              <div className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
