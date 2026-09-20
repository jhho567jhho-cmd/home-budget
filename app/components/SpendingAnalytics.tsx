'use client'

import { useState, useMemo } from 'react'

interface Expense {
  id: number
  description: string
  amount: number
  category: string
  date: string
}

interface SpendingAnalyticsProps {
  expenses?: Expense[]
  monthlyBudget?: number
}

export default function SpendingAnalytics({ expenses = [], monthlyBudget = 10000 }: SpendingAnalyticsProps) {
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

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <p className="text-sm text-blue-600 font-medium">הוצאות חודש זה</p>
          <p className="text-3xl font-bold text-blue-700 mt-2">₪{totalSpent.toFixed(2)}</p>
          <p className="text-xs text-blue-600 mt-2">מתוך תקציב של ₪{monthlyBudget.toFixed(2)}</p>
        </div>

        <div
          className={`${
            spendingTrend === 'over'
              ? 'from-red-50 to-red-100 border-red-200'
              : 'from-green-50 to-green-100 border-green-200'
          } bg-gradient-to-br rounded-lg p-6 border`}
        >
          <p className="text-sm font-medium text-slate-600">
            {spendingTrend === 'over' ? '⚠️ הוצאות גבוהות מהצפי' : '✅ הוצאות בשליטה'}
          </p>
          <p
            className={`text-3xl font-bold mt-2 ${
              spendingTrend === 'over' ? 'text-red-700' : 'text-green-700'
            }`}
          >
            {spendingTrend === 'over' ? '+' : ''}
            {trendPercentage}%
          </p>
          <p className="text-xs text-slate-600 mt-2">
            {spendingTrend === 'over'
              ? `יותר מהתקציב היומי של ₪${expectedDailySpend.toFixed(2)}`
              : `פחות מהתקציב היומי של ₪${expectedDailySpend.toFixed(2)}`}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <p className="text-sm text-purple-600 font-medium">התחזוקה לשאר החודש</p>
          <p className={`text-3xl font-bold mt-2 ${remainingBudget >= 0 ? 'text-purple-700' : 'text-red-700'}`}>
            ₪{remainingBudget.toFixed(2)}
          </p>
          <p className="text-xs text-purple-600 mt-2">
            {remainingBudget >= 0
              ? `יום זה ${dayOfMonth}/${daysInMonth}`
              : 'חרגת מהתקציב!'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 border border-amber-200">
          <p className="text-sm text-amber-600 font-medium">התחזוקה משוערת</p>
          <p className="text-3xl font-bold text-amber-700 mt-2">₪{projectedMonthlySpend.toFixed(2)}</p>
          <p className="text-xs text-amber-600 mt-2">
            {projectedMonthlySpend > monthlyBudget
              ? `₪${(projectedMonthlySpend - monthlyBudget).toFixed(2)} מעל התקציב`
              : `₪${(monthlyBudget - projectedMonthlySpend).toFixed(2)} בתוך התקציב`}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      {categoryBreakdown.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">📊 חלוקה לפי קטגוריה</h3>
          <div className="space-y-3">
            {categoryBreakdown.map((item) => (
              <div key={item.category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">{item.category}</span>
                  <span className="text-sm font-semibold text-slate-800">
                    ₪{item.amount.toFixed(2)} ({Math.round(item.percentage)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Spending Insights */}
      <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
        <h3 className="text-lg font-semibold text-indigo-900 mb-4">💡 תובנות הוצאה</h3>
        <ul className="space-y-2 text-sm text-indigo-800">
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
            <li className="text-red-700">
              • <strong>⚠️ חזו:</strong> אם תמשיך בקצב הזה, תחרוג ב-₪{Math.abs(projectedMonthlySpend - monthlyBudget).toFixed(2)} מהתקציב
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
