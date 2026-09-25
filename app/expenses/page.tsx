'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useHealth } from '@/app/context/ExpensesContext'

export default function HealthEntriesPage() {
  const { entries, addEntry, deleteEntry } = useHealth()
  const [formData, setFormData] = useState({ note: '', value: '', type: '', unit: '', date: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.note && formData.value && formData.type && formData.date && formData.unit) {
      addEntry({
        note: formData.note,
        value: parseFloat(formData.value),
        type: formData.type,
        unit: formData.unit,
        date: formData.date,
      })
      setFormData({ note: '', value: '', type: '', unit: '', date: '' })
    }
  }

  const totalValue = entries.reduce((sum, entry) => sum + entry.value, 0)
  const types = [...new Set(entries.map(e => e.type))]
  const units = [...new Set(entries.map(e => e.unit))]

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 shadow-lg border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">ניהול בריאות</h1>
              <p className="text-gray-400 mt-2">עקוב אחרי רישומי הבריאות שלך</p>
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
              <h2 className="text-xl font-bold mb-4">הוסף רישום בריאות</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold opacity-90 mb-2">הערה</label>
                  <input
                    type="text"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                    placeholder="תיאור הרישום"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">סוג</label>
                  <input
                    type="text"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                    placeholder="פעילות, תזונה, שינה, וכו'"
                    list="types"
                  />
                  <datalist id="types">
                    {types.map((t) => (
                      <option key={t} value={t} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">ערך</label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                    placeholder="0.00"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">יחידה</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                    placeholder="דקות, קלוריות, גרם, וכו'"
                    list="units"
                  />
                  <datalist id="units">
                    {units.map((u) => (
                      <option key={u} value={u} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">תאריך</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  הוסף רישום
                </button>
              </form>
            </div>
          </div>

          {/* Statistics & List */}
          <div className="md:col-span-2 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
                <p className="text-red-100 text-sm opacity-90">סך הערכים</p>
                <p className="text-3xl font-bold mt-2">{totalValue.toFixed(1)}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                <p className="text-purple-100 text-sm opacity-90">מספר רישומים</p>
                <p className="text-3xl font-bold mt-2">{entries.length}</p>
              </div>
            </div>

            {/* Health Entries List */}
            <div className="bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-slate-700">
                <h2 className="text-xl font-bold text-white">רישומי בריאות</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-200">הערה</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-200">סוג</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-200">ערך</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-200">יחידה</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-200">תאריך</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-200">פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry) => (
                      <tr key={entry.id} className="border-t border-slate-700 hover:bg-slate-700 transition">
                        <td className="px-6 py-4 text-sm text-gray-300">{entry.note}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-3 py-1 bg-blue-900 bg-opacity-50 text-blue-200 rounded-full text-xs font-semibold">
                            {entry.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-200">{entry.value.toFixed(1)}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-3 py-1 bg-purple-900 bg-opacity-50 text-purple-200 rounded-full text-xs font-semibold">
                            {entry.unit}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">{entry.date}</td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => {
                              if (confirm('האם בטוח שאתה רוצה למחוק רישום זה?')) {
                                deleteEntry(entry.id)
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
