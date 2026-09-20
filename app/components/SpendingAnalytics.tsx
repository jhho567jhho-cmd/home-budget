'use client'

import { useState, useMemo } from 'react'

interface Expense {
  id: number
  description: string
  amount: number
  category: string
  date: string
  clientId?: string
  clientName?: string
}

interface SpendingAnalyticsProps {
  expenses?: Expense[]
  monthlyBudget?: number
  onAddExpense?: (expense: Omit<Expense, 'id'>) => void
  onDeleteExpense?: (id: number) => void
}

export default function SpendingAnalytics({ expenses = [], monthlyBudget = 10000, onAddExpense, onDeleteExpense }: SpendingAnalyticsProps) {
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [formData, setFormData] = useState({ description: '', amount: '', category: '', date: '' })
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const dayOfMonth = today.getDate()

  const monthlyExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const expDate = new Date(e.date)
      return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear
    })
  }, [expenses, currentMonth, currentYear])

  const totalSpent = useMemo(() => monthlyExpenses.reduce((sum, e) => sum + e.amount, 0), [monthlyExpenses])

  const categoryBreakdown = useMemo(() => {
    const breakdown: Record<string, number> = {}
    monthlyExpenses.forEach((e) => {
      breakdown[e.category] = (breakdown[e.category] || 0) + e.amount
    })
    return Object.entries(breakdown)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / totalSpent) * 100,
      }))
      .sort((a, b) => b.amount - a.amount)
  }, [monthlyExpenses, totalSpent])

  const expectedDailySpend = monthlyBudget / daysInMonth
  const actualDailyAverage = totalSpent / dayOfMonth
  const projectedMonthlySpend = actualDailyAverage * daysInMonth
  const remainingBudget = monthlyBudget - totalSpent
  const spendingTrend = actualDailyAverage > expectedDailySpend ? 'over' : 'under'
  const trendPercentage = Math.round(((actualDailyAverage - expectedDailySpend) / expectedDailySpend) * 100)

  const dailySpending = useMemo(() => {
    const daily: Record<string, number> = {}
    for (let i = 1; i <= dayOfMonth; i++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      daily[dateStr] = 0
    }
    monthlyExpenses.forEach((e) => {
      daily[e.date] = (daily[e.date] || 0) + e.amount
    })
    return Object.entries(daily).map(([date, amount]) => ({ date, amount }))
  }, [monthlyExpenses, dayOfMonth, currentMonth, currentYear])

  const lastSevenDays = dailySpending.slice(-7)
  const avgLast7Days = lastSevenDays.reduce((sum, d) => sum + d.amount, 0) / lastSevenDays.length

  const handleAddExpense = () => {
    if (formData.description && formData.amount && formData.category && formData.date) {
      onAddExpense?.({
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        clientId: undefined,
        clientName: undefined,
      })
      setFormData({ description: '', amount: '', category: '', date: '' })
      setSelectedCard(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button onClick={() => setSelectedCard('expenses')} className="text-left hover:scale-105 transition-transform">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-lg text-white cursor-pointer">
            <p className="text-sm font-medium opacity-90">הוצאות חודש זה</p>
            <p className="text-3xl font-bold mt-2">₪{totalSpent.toFixed(2)}</p>
            <p className="text-xs opacity-75 mt-2">מתוך תקציב של ₪{monthlyBudget.toFixed(2)}</p>
          </div>
        </button>

        <button onClick={() => setSelectedCard('trend')} className="text-left hover:scale-105 transition-transform">
          <div className={`bg-gradient-to-br ${spendingTrend === 'over' ? 'from-red-500 to-red-600' : 'from-green-500 to-emerald-600'} rounded-2xl p-6 shadow-lg text-white cursor-pointer`}>
            <p className="text-sm font-medium opacity-90">
              {spendingTrend === 'over' ? '⚠️ הוצאות גבוהות מהצפי' : '✅ הוצאות בשליטה'}
            </p>
            <p className="text-3xl font-bold mt-2">
              {spendingTrend === 'over' ? '+' : ''}
              {trendPercentage}%
            </p>
            <p className="text-xs opacity-75 mt-2">
              {spendingTrend === 'over'
                ? `יותר מהתקציב היומי של ₪${expectedDailySpend.toFixed(2)}`
                : `פחות מהתקציב היומי של ₪${expectedDailySpend.toFixed(2)}`}
            </p>
          </div>
        </button>

        <button onClick={() => setSelectedCard('remaining')} className="text-left hover:scale-105 transition-transform">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-lg text-white cursor-pointer">
            <p className="text-sm font-medium opacity-90">התחזוקה לשאר החודש</p>
            <p className="text-3xl font-bold mt-2">
              ₪{remainingBudget.toFixed(2)}
            </p>
            <p className="text-xs opacity-75 mt-2">
              {remainingBudget >= 0
                ? `יום זה ${dayOfMonth}/${daysInMonth}`
                : 'חרגת מהתקציב!'}
            </p>
          </div>
        </button>

        <button onClick={() => setSelectedCard('projected')} className="text-left hover:scale-105 transition-transform">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-lg text-white cursor-pointer">
            <p className="text-sm font-medium opacity-90">התחזוקה משוערת</p>
            <p className="text-3xl font-bold mt-2">₪{projectedMonthlySpend.toFixed(2)}</p>
            <p className="text-xs opacity-75 mt-2">
              {projectedMonthlySpend > monthlyBudget
                ? `₪${(projectedMonthlySpend - monthlyBudget).toFixed(2)} מעל התקציב`
                : `₪${(monthlyBudget - projectedMonthlySpend).toFixed(2)} בתוך התקציב`}
            </p>
          </div>
        </button>
      </div>

      {/* Modal */}
      {selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">
                {selectedCard === 'expenses' && 'הוסף הוצאה חדשה'}
                {selectedCard === 'trend' && 'הוצאות החודש'}
                {selectedCard === 'remaining' && 'בדוק התחזוקה'}
                {selectedCard === 'projected' && 'תחזוקה משוערת'}
              </h3>
              <button onClick={() => setSelectedCard(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            {selectedCard === 'expenses' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">תיאור</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-500 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="תיאור ההוצאה"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">סכום</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-500 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">קטגוריה</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-500 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="קטגוריה"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">תאריך</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-500 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <button
                  onClick={handleAddExpense}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition"
                >
                  הוסף הוצאה
                </button>
              </div>
            )}

            {selectedCard !== 'expenses' && (
              <div className="text-gray-300 text-sm">
                {selectedCard === 'trend' && (
                  <p>קצב הוצאה יומי: ₪{actualDailyAverage.toFixed(2)} (תקציב: ₪{expectedDailySpend.toFixed(2)})</p>
                )}
                {selectedCard === 'remaining' && (
                  <p>עדיין יש לך ₪{remainingBudget.toFixed(2)} לשאר החודש</p>
                )}
                {selectedCard === 'projected' && (
                  <p>על בסיס קצב הוצאה נוכחי, תוציא ₪{projectedMonthlySpend.toFixed(2)} בחודש</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      {categoryBreakdown.length > 0 && (
        <div className="bg-slate-800 rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">📊 חלוקה לפי קטגוריה</h3>
          <div className="space-y-3">
            {categoryBreakdown.map((item) => (
              <div key={item.category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-300">{item.category}</span>
                  <span className="text-sm font-semibold text-white">
                    ₪{item.amount.toFixed(2)} ({Math.round(item.percentage)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Spending Insights */}
      <div className="bg-slate-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">💡 תובנות הוצאה</h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li>
            • <strong>ממוצע יומי:</strong> ₪{actualDailyAverage.toFixed(2)} (תקציב: ₪{expectedDailySpend.toFixed(2)})
          </li>
          <li>
            • <strong>7 ימים אחרונים:</strong> ממוצע של ₪{avgLast7Days.toFixed(2)} ליום
          </li>
          {categoryBreakdown.length > 0 && (
            <li>
              • <strong>קטגוריה הגבוהה ביותר:</strong> {categoryBreakdown[0].category} (₪{categoryBreakdown[0].amount.toFixed(2)})
            </li>
          )}
          {spendingTrend === 'over' && (
            <li className="text-red-400">
              • <strong>⚠️ חזו:</strong> אם תמשיך בקצב הזה, תחרוג ב-₪{Math.abs(projectedMonthlySpend - monthlyBudget).toFixed(2)} מהתקציב
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
