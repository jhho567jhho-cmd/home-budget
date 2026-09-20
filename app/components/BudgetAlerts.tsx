'use client'

import { useState, useEffect } from 'react'

interface BudgetAlert {
  id: string
  monthlyLimit: number
  alertThreshold: number
  isEnabled: boolean
}

export default function BudgetAlerts() {
  const [budget, setBudget] = useState<BudgetAlert>({
    id: 'main-budget',
    monthlyLimit: 10000,
    alertThreshold: 80,
    isEnabled: true,
  })

  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('budgetAlerts')
    if (saved) {
      setBudget(JSON.parse(saved))
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem('budgetAlerts', JSON.stringify(budget))
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  const calculateBudgetStatus = () => {
    const dailyAllowance = budget.monthlyLimit / 30
    const today = new Date().getDate()
    const expectedSpend = dailyAllowance * today
    const alertLevel = Math.round((budget.alertThreshold / 100) * budget.monthlyLimit)

    return { expectedSpend, alertLevel }
  }

  const status = calculateBudgetStatus()

  return (
    <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
      <h2 className="text-lg font-semibold mb-4">🎯 הגדרות תקציב</h2>

      <div className="space-y-4">
        {/* Monthly Limit */}
        <div>
          <label className="block text-sm font-medium opacity-90 mb-2">
            תקציב חודשי
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={budget.monthlyLimit}
              onChange={(e) => setBudget({ ...budget, monthlyLimit: Number(e.target.value) })}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 bg-white text-slate-900"
            />
            <span className="opacity-90">₪</span>
          </div>
        </div>

        {/* Alert Threshold */}
        <div>
          <label className="block text-sm font-medium opacity-90 mb-2">
            התרעה בעת חריגה ל-{budget.alertThreshold}% (₪{status.alertLevel})
          </label>
          <input
            type="range"
            min="50"
            max="100"
            value={budget.alertThreshold}
            onChange={(e) => setBudget({ ...budget, alertThreshold: Number(e.target.value) })}
            className="w-full"
          />
        </div>

        {/* Enable/Disable */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={budget.isEnabled}
            onChange={(e) => setBudget({ ...budget, isEnabled: e.target.checked })}
            className="w-4 h-4 rounded"
          />
          <label className="text-sm font-medium opacity-90">הפעל התרעות</label>
        </div>

        {/* Info */}
        <div className="bg-blue-900 bg-opacity-50 border border-blue-400 rounded-lg p-3 text-sm text-blue-100">
          <div className="font-semibold mb-1">💡 מידע שימושי:</div>
          <p>כל יום אתה יכול להוציא בערך ₪{Math.round(budget.monthlyLimit / 30)} כדי להישאר בתקציב</p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className={`w-full font-semibold py-2 rounded-lg transition ${
            isSaved
              ? 'bg-green-500 text-white'
              : 'bg-white text-blue-600 hover:bg-gray-100'
          }`}
        >
          {isSaved ? '✅ שמור בהצלחה!' : '💾 שמור הגדרות'}
        </button>
      </div>
    </div>
  )
}
