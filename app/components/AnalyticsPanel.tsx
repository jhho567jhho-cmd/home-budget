'use client'

import { RecurringExpense, SavingsSuggestion, BudgetAlert } from '@/app/utils/nlpAdvanced'

interface AnalyticsPanelProps {
  recurring: RecurringExpense[]
  suggestions: SavingsSuggestion[]
  alerts: BudgetAlert[]
  predictedMonthly: number
}

export function AnalyticsPanel({
  recurring,
  suggestions,
  alerts,
  predictedMonthly,
}: AnalyticsPanelProps) {
  return (
    <div className="space-y-4 text-sm">
      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border ${
                alert.type === 'danger'
                  ? 'bg-red-900/30 border-red-500/50 text-red-300'
                  : alert.type === 'warning'
                    ? 'bg-yellow-900/30 border-yellow-500/50 text-yellow-300'
                    : 'bg-blue-900/30 border-blue-500/50 text-blue-300'
              }`}
            >
              {alert.message}
            </div>
          ))}
        </div>
      )}

      {/* Predicted Monthly */}
      {predictedMonthly > 0 && (
        <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-3">
          <p className="text-gray-400">🔮 ניבוי לסוף החודש</p>
          <p className="text-2xl font-bold text-purple-300">₪{predictedMonthly.toFixed(0)}</p>
        </div>
      )}

      {/* Recurring Expenses */}
      {recurring.length > 0 && (
        <div>
          <h4 className="font-semibold text-indigo-300 mb-2">🔄 הוצאות חוזרות</h4>
          <div className="space-y-2">
            {recurring.slice(0, 3).map((r, idx) => (
              <div key={idx} className="bg-gray-800/50 p-2 rounded-lg text-xs">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-300">{r.pattern}</span>
                  <span className="text-indigo-400">₪{r.averageAmount.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>{r.frequency === 'daily' ? '📅 יומי' : r.frequency === 'weekly' ? '📊 שבועי' : '📈 חודשי'}</span>
                  <span>{Math.round(r.confidence * 100)}% ודאות</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Savings Suggestions */}
      {suggestions.length > 0 && (
        <div>
          <h4 className="font-semibold text-green-300 mb-2">💡 הצעות חיסכון</h4>
          <div className="space-y-2">
            {suggestions.slice(0, 3).map((s, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg text-xs border ${
                  s.priority === 'high'
                    ? 'border-green-500/50 bg-green-900/20'
                    : 'border-yellow-500/50 bg-yellow-900/20'
                }`}
              >
                <div className="font-semibold text-green-300 mb-1">{s.title}</div>
                <p className="text-gray-400 text-xs mb-1">{s.description}</p>
                <div className="text-green-400 font-bold">
                  + חיסכון: ₪{s.monthlyPotential.toFixed(0)}/חודש
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
