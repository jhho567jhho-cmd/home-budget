'use client'

import { useState } from 'react'
import { useProfile } from '../../contexts/ProfileContext'

export default function ProfileScreen() {
  const { profile, setName, updateProfile } = useProfile()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    waterGoal: profile?.preferences.waterGoal || 8,
    sleepGoal: profile?.preferences.sleepGoal || 8
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setName(formData.name)
    updateProfile({
      preferences: {
        ...profile?.preferences,
        waterGoal: formData.waterGoal,
        sleepGoal: formData.sleepGoal
      }
    })
    setIsEditing(false)
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 animate-fadeIn">
      <h1 className="text-3xl font-bold mb-6">👤 פרופיל שלי</h1>

      {/* פרטים אישיים */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">👋 פרטים אישיים</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-small"
          >
            {isEditing ? '❌ ביטול' : '✏️ עריכה'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">שם</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">יעד מים (כוסות)</label>
                <input
                  type="number"
                  value={formData.waterGoal}
                  onChange={e => setFormData({ ...formData, waterGoal: parseInt(e.target.value) })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  min="1"
                  max="20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">יעד שינה (שעות)</label>
                <input
                  type="number"
                  value={formData.sleepGoal}
                  onChange={e => setFormData({ ...formData, sleepGoal: parseInt(e.target.value) })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  min="4"
                  max="12"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full">
              ✓ שמור שינויים
            </button>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">שם:</span>
              <span className="font-medium">{profile?.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">🥤 יעד מים:</span>
              <span className="font-medium">{profile?.preferences.waterGoal} כוסות</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">😴 יעד שינה:</span>
              <span className="font-medium">{profile?.preferences.sleepGoal} שעות</span>
            </div>
          </div>
        )}
      </div>

      {/* שעות ארוחות */}
      <div className="card mb-6">
        <h2 className="text-xl font-bold mb-4">⏰ שעות ארוחות</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span>🍳 בוקר:</span>
            <span className="font-medium">{profile?.preferences.mealTimes.breakfast}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>☕ ביניים:</span>
            <span className="font-medium">{profile?.preferences.mealTimes.snack}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>🍗 צהריים:</span>
            <span className="font-medium">{profile?.preferences.mealTimes.lunch}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>🥗 ערב:</span>
            <span className="font-medium">{profile?.preferences.mealTimes.dinner}</span>
          </div>
        </div>
      </div>

      {/* טיפים */}
      <div className="card bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/30">
        <p className="text-sm">
          💡 <strong>טיפ:</strong> שימור פרטים אישיים עוזר לנו לתת לך הצעות מותאמות יותר!
        </p>
      </div>
    </div>
  )
}
