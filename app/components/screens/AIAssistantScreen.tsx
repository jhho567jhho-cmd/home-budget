'use client'

import { useState } from 'react'
import { useConversation } from '../../contexts/ConversationContext'
import { useProfile } from '../../contexts/ProfileContext'

export default function AIAssistantScreen() {
  const { messages, addMessage } = useConversation()
  const { profile } = useProfile()
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // תשובות מדומות מ-AI
  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes('ארוחה') || lowerMessage.includes('אכול')) {
      return '🍽️ הצעה: אתה יכול לאכול סלט טונה עם לחם מלא - זה בריא ויותיר אותך שבע! 💪'
    }
    if (lowerMessage.includes('מה') && lowerMessage.includes('השבוע')) {
      return '📊 השבוע שלך נראה טוב! הושלמת 5 מתוך 7 ימים את כל ההרגלים. המשך כך! 🌟'
    }
    if (lowerMessage.includes('סטריק') || lowerMessage.includes('הרגל')) {
      return '🔥 הסטריק המקסימלי שלך הוא 5 ימים! כדי להגביר אותו, נסה להשלים את ההרגלים בשעה זהה כל יום.'
    }
    if (lowerMessage.includes('טיפ')) {
      return '💡 טיפ היום: שתיית מים בבוקר עוזרת להפעיל את הגוף שלך! נסה לשתות כוס מים חמה עם לימון בעוד כמה דקות. 💧'
    }

    return `שלום ${profile?.name}! 👋 אני כאן בעזרה. תן לי לשאול - מה בעצם אתה רוצה עכשיו? 🤔`
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // הוסף הודעה של המשתמש
    addMessage(input, 'user')
    setInput('')
    setIsLoading(true)

    // סימולציה של טעינה
    setTimeout(() => {
      const response = getAIResponse(input)
      addMessage(response, 'assistant')
      setIsLoading(false)
    }, 800)
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 flex flex-col h-screen animate-fadeIn">
      <h1 className="text-3xl font-bold mb-6">🤖 העוזר שלך</h1>

      {/* אזור ההודעות */}
      <div className="flex-1 overflow-y-auto mb-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-slate-400 py-12">
            <p className="text-2xl mb-2">👋 שלום!</p>
            <p className="mb-4">אני כאן בעזרה לתכנון הארוחות וההרגלים שלך.</p>
            <p className="text-sm">שאל אותי משהו! למשל:</p>
            <div className="mt-4 space-y-2">
              <p className="text-sm">• מה כדאי לי לאכול?</p>
              <p className="text-sm">• איך הסטריק שלי?</p>
              <p className="text-sm">• תכנן לי ארוחות</p>
            </div>
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideInUp`}
            >
              <div
                className={`max-w-xs rounded-lg px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-100'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs opacity-60 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString('he-IL', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 rounded-lg px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* טופס השליחה */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="שאל אותי משהו..."
          className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary px-6"
        >
          {isLoading ? '⏳' : '📤'}
        </button>
      </form>
    </div>
  )
}
