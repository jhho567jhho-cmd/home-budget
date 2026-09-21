'use client'

import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

export default function LoginScreen() {
  const { login } = useAuth()
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setError('אנא הזן שם')
      return
    }

    if (name.trim().length < 2) {
      setError('השם חייב להיות לפחות 2 תווים')
      return
    }

    login(name)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-md">
        {/* לוגו וכותרת */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4 animate-bounce">⚖️</div>
          <h1 className="text-4xl font-bold mb-2">LifeBalance</h1>
          <p className="text-slate-400 text-lg">ניהול יום ויום חכם</p>
        </div>

        {/* טופס התחברות */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-8 border border-slate-600">
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3 text-slate-300">
                שלום! מה שמך? 👋
              </label>
              <input
                type="text"
                value={name}
                onChange={e => {
                  setName(e.target.value)
                  setError('')
                }}
                placeholder="למשל: דני"
                className="w-full bg-slate-600 border border-slate-500 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-6">
                <p className="text-sm text-red-300">❌ {error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-blue-500/30"
            >
              🚀 התחל עכשיו
            </button>
          </div>

          {/* מידע */}
          <div className="text-center text-sm text-slate-400">
            <p className="mb-3">🔒 הנתונים שלך משמורים בטוח בדפדפן שלך</p>
            <p className="text-xs text-slate-500">
              ✨ כל משתמש רואה רק את הנתונים שלו
            </p>
          </div>
        </form>

        {/* תכונות */}
        <div className="mt-12 space-y-4">
          <div className="flex items-center gap-3 text-slate-300">
            <span className="text-2xl">🍽️</span>
            <span>תכנון ארוחות</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <span className="text-2xl">🔥</span>
            <span>מעקב הרגלים עם סטריק</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <span className="text-2xl">📊</span>
            <span>סטטיסטיקות וניתוח</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <span className="text-2xl">🤖</span>
            <span>עוזר AI חכם</span>
          </div>
        </div>
      </div>
    </div>
  )
}
