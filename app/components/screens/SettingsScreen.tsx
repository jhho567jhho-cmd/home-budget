'use client'

import { useState, useEffect } from 'react'

interface SettingsScreenProps {
  onBack?: () => void
}

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)

  useEffect(() => {
    const savedKey = localStorage.getItem('anthropicApiKey')
    if (savedKey) {
      setApiKey(savedKey)
    }
  }, [])

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('anthropicApiKey', apiKey)
    }
  }

  const handleClearApiKey = () => {
    setApiKey('')
    localStorage.removeItem('anthropicApiKey')
  }

  return (
    <div className="px-4 pt-6 pb-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-2xl hover:opacity-70 transition">
          ←
        </button>
        <h1 className="text-3xl font-bold text-slate-800">הגדרות</h1>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* API Configuration */}
        <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">⚙️ הגדרות API</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Anthropic API Key
              </label>
              <div className="flex gap-2">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-ant-..."
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition"
                >
                  {showKey ? 'הסתר' : 'הצג'}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                קנה את המפתח מ- <a href="https://console.anthropic.com/account/keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Anthropic Console</a>
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSaveApiKey}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
              >
                שמור
              </button>
              <button
                onClick={handleClearApiKey}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 rounded-lg transition border border-red-200"
              >
                נקה
              </button>
            </div>
          </div>
        </div>

        {/* App Info */}
        <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">ℹ️ מידע על האפליקציה</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">שם האפליקציה</span>
              <span className="font-medium text-slate-800">NLP Coach</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">גרסה</span>
              <span className="font-medium text-slate-800">1.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">סוג</span>
              <span className="font-medium text-slate-800">Web App</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">שפה</span>
              <span className="font-medium text-slate-800">עברית</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
