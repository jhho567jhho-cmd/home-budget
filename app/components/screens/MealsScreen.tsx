'use client'

import { useState } from 'react'
import { useMeals } from '../../contexts/MealsContext'
import { Meal } from '../../types'

export default function MealsScreen() {
  const { meals, addMeal } = useMeals()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    time: '12:00',
    type: 'lunch' as Meal['type'],
    calories: '',
    notes: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    addMeal({
      id: Date.now().toString(),
      name: formData.name,
      time: formData.time,
      type: formData.type,
      calories: formData.calories ? parseInt(formData.calories) : undefined,
      notes: formData.notes,
      completed: false,
      ingredients: []
    })

    setFormData({
      name: '',
      time: '12:00',
      type: 'lunch',
      calories: '',
      notes: ''
    })
    setShowForm(false)
  }

  const mealTypes = [
    { value: 'breakfast' as const, label: '🍳 ארוחת בוקר' },
    { value: 'snack' as const, label: '☕ ארוחת ביניים' },
    { value: 'lunch' as const, label: '🍗 ארוחת צהריים' },
    { value: 'dinner' as const, label: '🥗 ארוחת ערב' }
  ]

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 animate-fadeIn">
      <h1 className="text-3xl font-bold mb-6">🍽️ תכנון ארוחות</h1>

      {/* כפתור הוסף */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="btn-primary w-full mb-6"
      >
        {showForm ? '❌ ביטול' : '➕ הוסף ארוחה'}
      </button>

      {/* טופס הוסף */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">שם הארוחה</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400"
              placeholder="למשל: דגים עם ירקות"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">שעה</label>
              <input
                type="time"
                value={formData.time}
                onChange={e => setFormData({ ...formData, time: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">סוג ארוחה</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as Meal['type'] })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              >
                {mealTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">קלוריות (אופציונלי)</label>
            <input
              type="number"
              value={formData.calories}
              onChange={e => setFormData({ ...formData, calories: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400"
              placeholder="200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">הערות</label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 h-20 resize-none"
              placeholder="מרכיבים, הערות, וכו'"
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            ✓ שמור ארוחה
          </button>
        </form>
      )}

      {/* רשימת ארוחות */}
      <div className="space-y-3">
        {meals && meals.meals.length > 0 ? (
          meals.meals.map(meal => (
            <div key={meal.id} className="card card-hover">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{meal.name}</h3>
                  <p className="text-sm text-slate-400">⏰ {meal.time}</p>
                  {meal.calories && (
                    <p className="text-sm text-slate-400">🔥 {meal.calories} קלוריות</p>
                  )}
                  {meal.notes && (
                    <p className="text-xs text-slate-500 mt-1">📝 {meal.notes}</p>
                  )}
                </div>
                <span className="text-2xl">{meal.completed ? '✓' : '○'}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="card text-center text-slate-400 py-12">
            <p className="text-lg mb-2">אין ארוחות עדיין</p>
            <p className="text-sm">הוסף ארוחה בלחיצה על הכפתור למעלה</p>
          </div>
        )}
      </div>
    </div>
  )
}
