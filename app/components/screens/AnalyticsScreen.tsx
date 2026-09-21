'use client'

import { useMemo } from 'react'
import { useExpenses } from '@/app/context/ExpensesContext'
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface AnalyticsScreenProps {
  onBack?: () => void
}

export default function AnalyticsScreen({ onBack }: AnalyticsScreenProps) {
  const { expenses } = useExpenses()

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316']

  // חישוב נתונים לגרפים
  const analyticsData = useMemo(() => {
    // הוצאות לפי קטגוריה
    const expensesByCategory = expenses.reduce(
      (acc, exp) => {
        const existing = acc.find((item) => item.name === exp.category)
        if (existing) {
          existing.value += exp.amount
        } else {
          acc.push({ name: exp.category, value: exp.amount })
        }
        return acc
      },
      [] as Array<{ name: string; value: number }>
    )

    // הוצאות לפי תאריך
    const expensesByDate = expenses
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((exp) => ({
        date: new Date(exp.date).toLocaleDateString('he-IL', { month: 'short', day: 'numeric' }),
        amount: exp.amount,
      }))

    // הוצאות לפי חודש
    const expensesByMonth = expenses.reduce(
      (acc, exp) => {
        const date = new Date(exp.date)
        const monthKey = date.toLocaleDateString('he-IL', { month: 'short', year: 'numeric' })
        const existing = acc.find((item) => item.month === monthKey)
        if (existing) {
          existing.total += exp.amount
        } else {
          acc.push({ month: monthKey, total: exp.amount })
        }
        return acc
      },
      [] as Array<{ month: string; total: number }>
    )

    // סטטיסטיקות
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
    const avgExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0
    const maxExpense = Math.max(...expenses.map((exp) => exp.amount), 0)
    const topCategory = expensesByCategory.sort((a, b) => b.value - a.value)[0]

    return {
      expensesByCategory,
      expensesByDate,
      expensesByMonth,
      stats: {
        total: totalExpenses,
        avg: avgExpense,
        max: maxExpense,
        count: expenses.length,
        topCategory: topCategory?.name || 'אין',
        topAmount: topCategory?.value || 0,
      },
    }
  }, [expenses])

  if (expenses.length === 0) {
    return (
      <div className="px-4 pt-6 pb-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="text-2xl hover:opacity-70 transition">
            ←
          </button>
          <h1 className="text-3xl font-bold text-slate-800">דוחות</h1>
        </div>
        <div className="bg-slate-100 rounded-lg p-8 text-center">
          <p className="text-slate-600 text-lg">אין הוצאות להצגה עדיין</p>
          <p className="text-slate-500 text-sm mt-2">הוסף הוצאות כדי לראות דוחות</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 pt-6 pb-6 max-w-4xl mx-auto bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-2xl hover:opacity-70 transition">
          ←
        </button>
        <h1 className="text-3xl font-bold text-slate-800">דוחות וניתוח</h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
          <p className="text-slate-600 text-sm">סך הוצאות</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">₪{analyticsData.stats.total.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
          <p className="text-slate-600 text-sm">ממוצע הוצאה</p>
          <p className="text-2xl font-bold text-green-600 mt-1">₪{analyticsData.stats.avg.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
          <p className="text-slate-600 text-sm">הוצאה מקסימלית</p>
          <p className="text-2xl font-bold text-red-600 mt-1">₪{analyticsData.stats.max.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
          <p className="text-slate-600 text-sm">מספר הוצאות</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{analyticsData.stats.count}</p>
        </div>
      </div>

      {/* Top Category */}
      {analyticsData.stats.topCategory !== 'אין' && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg p-4 mb-8 text-white shadow-md">
          <p className="text-sm opacity-90">הקטגוריה העלונה ביותר</p>
          <p className="text-xl font-bold">{analyticsData.stats.topCategory}</p>
          <p className="text-sm mt-1">₪{analyticsData.stats.topAmount.toFixed(2)}</p>
        </div>
      )}

      {/* Charts */}
      <div className="space-y-8">
        {/* Pie Chart - Categories */}
        {analyticsData.expensesByCategory.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4">הוצאות לפי קטגוריה</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.expensesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analyticsData.expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₪${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Line Chart - Trend */}
        {analyticsData.expensesByDate.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4">טרנד הוצאות</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.expensesByDate}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1' }}
                  formatter={(value) => `₪${value.toFixed(2)}`}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Bar Chart - Monthly */}
        {analyticsData.expensesByMonth.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4">הוצאות חודשיות</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.expensesByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1' }}
                  formatter={(value) => `₪${value.toFixed(2)}`}
                />
                <Legend />
                <Bar dataKey="total" fill="#10b981" name="סה״כ הוצאות" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
