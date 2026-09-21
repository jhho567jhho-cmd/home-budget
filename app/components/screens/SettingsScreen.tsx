'use client'

import { useState } from 'react'

interface SettingsScreenProps {
  onBack?: () => void
}

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('ANTHROPIC_API_KEY', apiKey)
      alert('מפתח API נשמר בהצלחה!')
      setApiKey('')
    }
  }

  return (
    <div className="px-4 pt-6 pb-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="text-2xl hover:opacity-70 transition"
        >
          ←
        </button>
        <h1 className="text-3xl font-bold text-slate-800">הגדרות</h1>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* API Key Section */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span>🔑</span>
            Claude API
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            הזן את מפתח ה-API שלך כדי להפעיל עוזרת Claude בתכונות מלאות
          </p>

          <div className="space-y-3">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showKey"
                checked={showApiKey}
                onChange={(e) => setShowApiKey(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="showKey" className="text-sm text-slate-600">
                הצג את המפתח
              </label>
            </div>

            <button
              onClick={handleSaveApiKey}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
            >
              שמור מפתח API
            </button>

            <p className="text-xs text-slate-500 mt-3">
              אבטחה: המפתח יישמר בהוג היקום שלך בלבד ולא יישלח לשרת כלשהו
            </p>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span>ℹ️</span>
            אודות
          </h2>
          <div className="space-y-2 text-sm text-slate-600">
            <p>
              <span className="font-semibold text-slate-800">שם האפליקציה:</span> NLP Coach
            </p>
            <p>
              <span className="font-semibold text-slate-800">גרסה:</span> 1.0
            </p>
            <p>
              <span className="font-semibold text-slate-800">סוג:</span> אפליקציית ניהול תקציב וקליינטים
            </p>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 <span className="font-semibold">עצה:</span> אתה יכול לעבוד עם העוזרת החינמית כרגע. אם תרצה עוזר עוד יותר חזק, הוסף את מפתח ה-API של Anthropic.
          </p>
        </div>
      </div>
    </div>
  )
}
