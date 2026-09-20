'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useExpenses } from '@/app/context/ExpensesContext'

export default function ExpensesPage() {
  const { expenses, addExpense } = useExpenses()
  const [formData, setFormData] = useState({ description: '', amount: '', category: '', date: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.description && formData.amount && formData.category && formData.date) {
      addExpense({
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
      })
      setFormData({ description: '', amount: '', category: '', date: '' })
    }
  }

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const categories = [...new Set(expenses.map(e => e.category))]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-indigo-600">ניהול הוצאות</h1>
              <p className="text-gray-600 mt-2">עקוב אחרי כל הוצאותיך</p>
            </div>
            <Link href="/" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              ← חזרה לעמוד הבית
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Form */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">הוסף הוצאה חדשה</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">תיאור</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="תיאור ההוצאה"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">סכום</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">קטגוריה</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="קטגוריה"
                    list="categories"
                  />
                  <datalist id="categories">
                    {categories.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">תאריך</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  הוסף הוצאה
                </button>
              </form>
            </div>
          </div>

          {/* Statistics & List */}
          <div className="md:col-span-2 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm">סך הוצאות</p>
                <p className="text-3xl font-bold text-indigo-600">₪{totalExpenses.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm">מספר הוצאות</p>
                <p className="text-3xl font-bold text-indigo-600">{expenses.length}</p>
              </div>
            </div>

            {/* Expenses List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">רשימת הוצאות</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">תיאור</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">קטגוריה</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">סכום</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">תאריך</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((expense) => (
                      <tr key={expense.id} className="border-t hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm">{expense.description}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold">₪{expense.amount.toFixed(2)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{expense.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
