'use client'

import { useState } from 'react'
import Link from 'next/link'

interface InventoryItem {
  id: number
  name: string
  quantity: number
  unit: string
  expiryDate: string
  cost: number
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([
    { id: 1, name: 'קמח', quantity: 2, unit: 'ק״ג', expiryDate: '2027-03-15', cost: 15 },
    { id: 2, name: 'שמן', quantity: 1, unit: 'ליטר', expiryDate: '2027-01-10', cost: 35 },
    { id: 3, name: 'סוכר', quantity: 500, unit: 'גרם', expiryDate: '2027-05-20', cost: 10 },
  ])

  const [formData, setFormData] = useState({ name: '', quantity: '', unit: '', expiryDate: '', cost: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.quantity && formData.unit && formData.expiryDate && formData.cost) {
      setItems([
        ...items,
        {
          id: items.length + 1,
          name: formData.name,
          quantity: parseFloat(formData.quantity),
          unit: formData.unit,
          expiryDate: formData.expiryDate,
          cost: parseFloat(formData.cost),
        },
      ])
      setFormData({ name: '', quantity: '', unit: '', expiryDate: '', cost: '' })
    }
  }

  const handleDelete = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const now = new Date()
  const soon = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  const expiredItems = items.filter((item) => new Date(item.expiryDate) < now)
  const expiringItems = items.filter(
    (item) => new Date(item.expiryDate) >= now && new Date(item.expiryDate) < soon,
  )

  const totalCost = items.reduce((sum, item) => sum + item.cost, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-indigo-600">מעקב מלאי</h1>
              <p className="text-gray-600 mt-2">ניהול חומרים וזיהוי תאריכי פקיעה</p>
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
              <h2 className="text-xl font-bold mb-4">הוסף פריט חדש</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">שם הפריט</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="שם הפריט"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">כמות</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">יחידת מידה</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="ק״ג, ליטר, וכו׳"
                    list="units"
                  />
                  <datalist id="units">
                    <option value="ק״ג" />
                    <option value="גרם" />
                    <option value="ליטר" />
                    <option value="מ״ל" />
                    <option value="חתיכה" />
                  </datalist>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">תאריך תפוקה</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">עלות</label>
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  הוסף פריט
                </button>
              </form>
            </div>
          </div>

          {/* Statistics & List */}
          <div className="md:col-span-2 space-y-6">
            {/* Alerts */}
            {(expiredItems.length > 0 || expiringItems.length > 0) && (
              <div className="space-y-3">
                {expiredItems.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="font-semibold text-red-700">⚠️ פריטים שפקעו ({expiredItems.length})</p>
                    <ul className="mt-2 text-sm text-red-600">
                      {expiredItems.map((item) => (
                        <li key={item.id}>{item.name} - פקע ב-{item.expiryDate}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {expiringItems.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="font-semibold text-yellow-700">🔔 פריטים שפוקעים בקרוב ({expiringItems.length})</p>
                    <ul className="mt-2 text-sm text-yellow-600">
                      {expiringItems.map((item) => (
                        <li key={item.id}>{item.name} - פוקע ב-{item.expiryDate}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm">סך הפריטים</p>
                <p className="text-3xl font-bold text-indigo-600">{items.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm">ערך מלאי כולל</p>
                <p className="text-3xl font-bold text-indigo-600">₪{totalCost.toFixed(2)}</p>
              </div>
            </div>

            {/* Items List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">רשימת מלאי</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">שם</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">כמות</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">תאריך תפוקה</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">עלות</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => {
                      const isExpired = new Date(item.expiryDate) < now
                      const isExpiring =
                        new Date(item.expiryDate) >= now && new Date(item.expiryDate) < soon

                      return (
                        <tr
                          key={item.id}
                          className={`border-t hover:bg-gray-50 ${isExpired ? 'bg-red-50' : isExpiring ? 'bg-yellow-50' : ''}`}
                        >
                          <td className="px-6 py-4 text-sm font-semibold">{item.name}</td>
                          <td className="px-6 py-4 text-sm">
                            {item.quantity} {item.unit}
                          </td>
                          <td className="px-6 py-4 text-sm">{item.expiryDate}</td>
                          <td className="px-6 py-4 text-sm font-semibold">₪{item.cost.toFixed(2)}</td>
                          <td className="px-6 py-4 text-sm">
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red-600 hover:text-red-700 font-semibold"
                            >
                              מחק
                            </button>
                          </td>
                        </tr>
                      )
                    })}
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
