'use client'

import { useState } from 'react'
import Link from 'next/link'

interface SavingsTip {
  id: number
  title: string
  description: string
  potential: number
  category: string
}

export default function SavingsPage() {
  const [tips, setTips] = useState<SavingsTip[]>([
    {
      id: 1,
      title: 'קניות בכמות',
      description: 'קנה מוצרים בכמות גדולה כדי לחסוך כסף',
      potential: 150,
      category: 'קניות',
    },
    {
      id: 2,
      title: 'השתמש בשירותי סטרימינג משותפים',
      description: 'שתוף בעלויות של סטרימינג עם משפחה וחברים',
      potential: 80,
      category: 'בידור',
    },
    {
      id: 3,
      title: 'הפחת צריכת חשמל',
      description: 'השתמש בנורות LED וכבה מכשירים שלא בשימוש',
      potential: 120,
      category: 'שירותים',
    },
  ])

  const [newTip, setNewTip] = useState({ title: '', description: '', potential: '' })
  const [priceComparison, setPriceComparison] = useState({
    product: '',
    store1: '',
    store2: '',
    price1: '',
    price2: '',
  })

  const handleAddTip = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTip.title && newTip.description && newTip.potential) {
      setTips([
        ...tips,
        {
          id: tips.length + 1,
          title: newTip.title,
          description: newTip.description,
          potential: parseFloat(newTip.potential),
          category: 'אחר',
        },
      ])
      setNewTip({ title: '', description: '', potential: '' })
    }
  }

  const totalPotentialSavings = tips.reduce((sum, tip) => sum + tip.potential, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-indigo-600">מחשבון חיסכון</h1>
              <p className="text-gray-600 mt-2">גלה הזדמנויות לחיסכון בכסף</p>
            </div>
            <Link href="/" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              ← חזרה לעמוד הבית
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg p-8 mb-8">
          <p className="text-white text-lg">סך הזדמנויות חיסכון פוטנציאליות</p>
          <p className="text-5xl font-bold text-white mt-2">₪{totalPotentialSavings.toFixed(2)}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Add New Savings Tip */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">הוסף עצה לחיסכון</h2>
            <form onSubmit={handleAddTip} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">כותרת</label>
                <input
                  type="text"
                  value={newTip.title}
                  onChange={(e) => setNewTip({ ...newTip, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="כותרת העצה"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">תיאור</label>
                <textarea
                  value={newTip.description}
                  onChange={(e) => setNewTip({ ...newTip, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="תיאור העצה"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">פוטנציאל חיסכון חודשי (₪)</label>
                <input
                  type="number"
                  value={newTip.potential}
                  onChange={(e) => setNewTip({ ...newTip, potential: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
              >
                הוסף עצה
              </button>
            </form>
          </div>

          {/* Price Comparison */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">השוואת מחירים</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">שם המוצר</label>
                <input
                  type="text"
                  value={priceComparison.product}
                  onChange={(e) => setPriceComparison({ ...priceComparison, product: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="שם המוצר"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">קניון 1</label>
                  <input
                    type="text"
                    value={priceComparison.store1}
                    onChange={(e) => setPriceComparison({ ...priceComparison, store1: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="שם קניון"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">מחיר 1</label>
                  <input
                    type="number"
                    value={priceComparison.price1}
                    onChange={(e) => setPriceComparison({ ...priceComparison, price1: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">קניון 2</label>
                  <input
                    type="text"
                    value={priceComparison.store2}
                    onChange={(e) => setPriceComparison({ ...priceComparison, store2: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="שם קניון"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">מחיר 2</label>
                  <input
                    type="number"
                    value={priceComparison.price2}
                    onChange={(e) => setPriceComparison({ ...priceComparison, price2: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>
              {priceComparison.price1 &&
                priceComparison.price2 &&
                Math.abs(parseFloat(priceComparison.price1) - parseFloat(priceComparison.price2)) >
                  0 && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-semibold text-blue-700">
                      {parseFloat(priceComparison.price1) < parseFloat(priceComparison.price2)
                        ? `${priceComparison.store1} זול יותר בـ ₪${(
                            parseFloat(priceComparison.price2) - parseFloat(priceComparison.price1)
                          ).toFixed(2)}`
                        : `${priceComparison.store2} זול יותר בـ ₪${(
                            parseFloat(priceComparison.price1) - parseFloat(priceComparison.price2)
                          ).toFixed(2)}`}
                    </p>
                  </div>
                )}
            </form>
          </div>
        </div>

        {/* Tips List */}
        <div className="bg-white rounded-lg shadow mt-8 overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">עצות לחיסכון</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 p-6">
            {tips.map((tip) => (
              <div key={tip.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <h3 className="font-semibold text-lg mb-2">{tip.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{tip.description}</p>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                    {tip.category}
                  </span>
                  <span className="text-green-600 font-bold">₪{tip.potential.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
