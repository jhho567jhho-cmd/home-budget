'use client'

import { useState } from 'react'

export default function AIScreen() {
  const [messages, setMessages] = useState<
    Array<{ role: 'user' | 'assistant'; content: string }>
  >([])
  const [inputValue, setInputValue] = useState('')

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // הוסף הודעה של משתמש
    setMessages((prev) => [...prev, { role: 'user', content: inputValue }])
    setInputValue('')

    // בהמשך - חיבור ל-API
    // כרגע - רק UI
  }

  return (
    <div className="px-4 pt-6 pb-6 max-w-2xl mx-auto h-screen flex flex-col">
      {/* Header */}
      <h1 className="text-3xl font-bold text-slate-800 mb-6">🤖 העוזרת שלי</h1>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto mb-6 bg-slate-50 rounded-lg p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-slate-500">
              <div className="text-5xl mb-4">💭</div>
              <p>שלום! כיצד אוכל לעזור לך?</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <button
          type="button"
          className="bg-slate-200 hover:bg-slate-300 text-slate-700 p-3 rounded-lg transition"
          title="רשם קול"
        >
          🎙️
        </button>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="כתוב משהו..."
          className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-right"
          dir="rtl"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg transition"
        >
          ➤
        </button>
      </form>
    </div>
  )
}
