'use client'

import { useState } from 'react'

interface LoginProps {
  onLogin: (email: string) => void
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('אנא מלא את כל השדות')
      return
    }

    if (!email.includes('@')) {
      setError('אנא הזן אימייל תקין')
      return
    }

    setIsLoading(true)

    // ממחזור - אנחנו עוד לא מחוברים ל-backend
    setTimeout(() => {
      onLogin(email)
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">💰</div>
          <h1 className="text-3xl font-bold text-white mb-2">Budget Buddy</h1>
          <p className="text-gray-400">אפליקציה פרטית לניהול תקציב ביתי</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-blue-100 mb-2">
              אימייל
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-3 rounded-lg border border-blue-300 bg-white text-slate-900 focus:border-white focus:ring-2 focus:ring-blue-300 text-right"
              dir="rtl"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-blue-100 mb-2">
              סיסמה
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-blue-300 bg-white text-slate-900 focus:border-white focus:ring-2 focus:ring-blue-300 text-right"
              dir="rtl"
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="p-4 bg-red-900 bg-opacity-50 border border-red-400 rounded-lg text-red-200 text-sm text-right">
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-blue-600 hover:bg-gray-100 disabled:bg-gray-400 disabled:text-gray-600 font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="inline-block animate-spin">⏳</span>
                טוען...
              </>
            ) : (
              'כניסה'
            )}
          </button>

          {/* Help text */}
          <div className="text-center text-sm text-blue-100 space-y-2">
            <p>אפליקציה פרטית לניהול תקציב ביתי</p>
            <p className="text-xs text-blue-200 opacity-75">היכנסו עם כל אימייל וסיסמה (הרשמה אוטומטית)</p>
          </div>
        </form>
      </div>
    </div>
  )
}
