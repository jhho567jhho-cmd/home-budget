'use client'

import { useState } from 'react'
import { useHabits } from '../../contexts/HabitsContext'
import HabitCheckBox from '../common/HabitCheckBox'

export default function HabitsScreen() {
  const { habits, toggleHabit, addHabit, getCompletionPercentage } = useHabits()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    emoji: '🎯',
    goal: '',
    category: 'custom' as const
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    addHabit({
      id: Date.now().toString(),
      name: formData.name,
      emoji: formData.emoji,
      category: formData.category,
      goal: formData.goal,
      completed: false,
      streak: 0,
      completionHistory: []
    })

    setFormData({
      name: '',
      emoji: '🎯',
      goal: '',
      category: 'custom'
    })
    setShowForm(false)
  }

  const completionPercentage = getCompletionPercentage()

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 animate-fadeIn">
      <h1 className="text-3xl font-bold mb-6">🔥 מעקב הרגלים</h1>

      {/* סטטיסטיקה */}
      <div className="card mb-6">
        <div className="text-center">
          <p className="text-slate-400 mb-2">התקדמות היום</p>
          <div className="text-4xl font-bold text-blue-300 mb-2">{completionPercentage}%</div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-sm text-slate-400 mt-3">
            {habits && habits.habits.filter(h => h.completed).length} מתוך {habits?.habits.length || 0} הרגלים הושלמו
          </p>
        </div>
      </div>

      {/* כפתור הוסף */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="btn-primary w-full mb-6"
      >
        {showForm ? '❌ ביטול' : '➕ הוסף הרגל'}
      </button>

      {/* טופס הוסף */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">שם ההרגל</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400"
              placeholder="למשל: יוגה יומית"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">אימוג'י</label>
              <input
                type="text"
                value={formData.emoji}
                onChange={e => setFormData({ ...formData, emoji: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-center"
                maxLength={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">קטגוריה</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="water">מים</option>
                <option value="exercise">פעילות</option>
                <option value="sleep">שינה</option>
                <option value="nutrition">תזונה</option>
                <option value="custom">אחר</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">יעד</label>
            <input
              type="text"
              value={formData.goal}
              onChange={e => setFormData({ ...formData, goal: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400"
              placeholder="למשל: 30 דקות"
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            ✓ שמור הרגל
          </button>
        </form>
      )}

      {/* רשימת הרגלים */}
      <div className="space-y-3">
        {habits && habits.habits.length > 0 ? (
          habits.habits.map(habit => (
            <HabitCheckBox
              key={habit.id}
              habit={habit}
              onToggle={() => toggleHabit(habit.id)}
            />
          ))
        ) : (
          <div className="card text-center text-slate-400 py-12">
            <p className="text-lg mb-2">אין הרגלים עדיין</p>
            <p className="text-sm">הוסף הרגל בלחיצה על הכפתור למעלה</p>
          </div>
        )}
      </div>
    </div>
  )
}
