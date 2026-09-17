'use client'

import { useState } from 'react'

interface Goal {
  id: string
  category: string
  limit: number
  spent: number
}

interface BudgetGoalsProps {
  goals: Goal[]
  onAddGoal?: (category: string, limit: number) => void
  onRemoveGoal?: (id: string) => void
}

export function BudgetGoals({ goals, onAddGoal, onRemoveGoal }: BudgetGoalsProps) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ category: '', limit: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.category && formData.limit && onAddGoal) {
      onAddGoal(formData.category, parseFloat(formData.limit))
      setFormData({ category: '', limit: '' })
      setShowForm(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-200">🎯 יעדי תקציב</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-xs bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-lg"
        >
          {showForm ? 'ביטול' : '+ הוסף'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-700/50 p-3 rounded-lg space-y-2">
          <input
            type="text"
            placeholder="קטגוריה"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm focus:outline-none focus:border-indigo-500"
            list="categories"
          />
          <datalist id="categories">
            <option value="קניות" />
            <option value="שירותים" />
            <option value="בידור" />
            <option value="ספורט" />
          </datalist>
          <input
            type="number"
            placeholder="יעד (₪)"
            value={formData.limit}
            onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
            className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm focus:outline-none focus:border-indigo-500"
            step="0.01"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 px-2 py-1 rounded text-sm font-semibold"
          >
            שמור יעד
          </button>
        </form>
      )}

      <div className="space-y-2">
        {goals.length === 0 ? (
          <p className="text-gray-500 text-sm">אין יעדי תקציב מוגדרים עדיין</p>
        ) : (
          goals.map((goal) => {
            const percentage = (goal.spent / goal.limit) * 100
            const status =
              percentage >= 100 ? 'text-red-400' : percentage >= 75 ? 'text-yellow-400' : 'text-green-400'

            return (
              <div key={goal.id} className="bg-gray-700/30 p-3 rounded-lg border border-gray-600/30">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-semibold">{goal.category}</span>
                  {onRemoveGoal && (
                    <button
                      onClick={() => onRemoveGoal(goal.id)}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      מחק
                    </button>
                  )}
                </div>
                <div className="h-2 bg-gray-600 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full transition-all ${
                      percentage >= 100 ? 'bg-red-500' : percentage >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <span className={status}>
                    ₪{goal.spent.toFixed(2)} / ₪{goal.limit.toFixed(2)}
                  </span>
                  <span className="text-gray-400">{percentage.toFixed(0)}%</span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
