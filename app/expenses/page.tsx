'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useExpenses } from '@/app/context/ExpensesContext'
import { useClients } from '@/app/context/ClientsContext'

export default function ExpensesPage() {
  const { expenses, addExpense, deleteExpense } = useExpenses()
  const { clients } = useClients()
  const [formData, setFormData] = useState({ description: '', amount: '', category: '', date: '', clientId: '', clientName: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.description && formData.amount && formData.category && formData.date) {
      addExpense({
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        clientId: formData.clientId || undefined,
        clientName: formData.clientName || undefined,
      })
      setFormData({ description: '', amount: '', category: '', date: '', clientId: '', clientName: '' })
    }
  }

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const categories = [...new Set(expenses.map(e => e.category))]

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 shadow-lg border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">ניהול הוצאות</h1>
              <p className="text-gray-400 mt-2">עקוב אחרי כל הוצאותיך</p>
            </div>
            <Link href="/" className="text-blue-400 hover:text-blue-300 font-semibold">
              ← חזרה לעמוד הבית
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Form */}
          <div className="md:col-span-1">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <h2 className="text-xl font-bold mb-4">הוסף הוצאה חדשה</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold opacity-90 mb-2">תיאור</label>
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
                <div>
                  <label className="block text-sm font-semibold mb-2">לקוח (אופציונלי)</label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => {
                      const selectedClient = clients.find(c => c.id === e.target.value)
                      setFormData({
                        ...formData,
                        clientId: e.target.value,
                        clientName: selectedClient?.name || ''
                      })
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">-- לא בחרת לקוח --</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
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
          <div className="md:col-span-2 space-y-6 min-w-0">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
                <p className="text-red-100 text-sm opacity-90">סך הוצאות</p>
                <p className="text-3xl font-bold mt-2">₪{totalExpenses.toFixed(2)}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                <p className="text-purple-100 text-sm opacity-90">מספר הוצאות</p>
                <p className="text-3xl font-bold mt-2">{expenses.length}</p>
              </div>
            </div>

            {/* Expenses List */}
            <div className="bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-slate-700">
                <h2 className="text-xl font-bold text-white">רשימת הוצאות</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-200">תיאור</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-200">לקוח</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-200">קטגוריה</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-200">סכום</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-200">תאריך</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-200">פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((expense) => (
                      <tr key={expense.id} className="border-t border-slate-700 hover:bg-slate-700 transition">
                        <td className="px-6 py-4 text-sm text-gray-300">{expense.description}</td>
                        <td className="px-6 py-4 text-sm">
                          {expense.clientName ? (
                            <span className="px-3 py-1 bg-blue-900 bg-opacity-50 text-blue-200 rounded-full text-xs font-semibold">
                              {expense.clientName}
                            </span>
                          ) : (
                            <span className="text-gray-500 text-xs">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-3 py-1 bg-purple-900 bg-opacity-50 text-purple-200 rounded-full text-xs font-semibold">
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-200">₪{expense.amount.toFixed(2)}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">{expense.date}</td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => {
                              if (confirm('האם בטוח שאתה רוצה למחוק הוצאה זו?')) {
                                deleteExpense(expense.id)
                              }
                            }}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold transition"
                          >
                            מחק
                          </button>
                        </td>
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
