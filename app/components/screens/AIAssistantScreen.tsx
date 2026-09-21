'use client'

import { useState, useEffect } from 'react'
import { useConversation } from '../../contexts/ConversationContext'
import { useProfile } from '../../contexts/ProfileContext'
import { useHabits } from '../../contexts/HabitsContext'
import { useMeals } from '../../contexts/MealsContext'
import { sendMessageToAI, hasAPIKey, getFallbackResponse } from '../../services/aiService'

export default function AIAssistantScreen() {
  const { messages, addMessage } = useConversation()
  const { profile } = useProfile()
  const { habits } = useHabits()
  const { meals } = useMeals()
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasAPI, setHasAPI] = useState(false)

  useEffect(() => {
    setHasAPI(hasAPIKey())
  }, [])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // הוסף הודעה של המשתמש
    addMessage(input, 'user')
    const userMessage = input
    setInput('')
    setIsLoading(true)

    try {
      // בנה context לAI
      const context = {
        userName: profile?.name || 'משתמש',
        currentHabits: habits?.habits.map(h => ({
          name: h.name,
          completed: h.completed,
          streak: h.streak
        })),
        upcomingMeals: meals?.meals.map(m => ({
          name: m.name,
          time: m.time
        })),
        todayStats: {
          completionPercentage: habits?.habits.length
            ? Math.round((habits.habits.filter(h => h.completed).length / habits.habits.length) * 100)
            : 0,
          mealsLogged: meals?.meals.length || 0,
          habitsCompleted: habits?.habits.filter(h => h.completed).length || 0
        }
      }

      // המר messages לformat שAI יכול להשתמש בו
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      let response: string

      if (hasAPI) {
        // שתמש בClaude API אמיתי
        response = await sendMessageToAI(userMessage, context, conversationHistory)
      } else {
        // שתמש בתשובה fallback
        response = getFallbackResponse(userMessage)
      }

      addMessage(response, 'assistant')
    } catch (error) {
      console.error('שגיאה:', error)
      addMessage('סליחה, קרתה שגיאה. אנא נסה שוב.', 'assistant')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 flex flex-col h-screen animate-fadeIn">
      <h1 className="text-3xl font-bold mb-6">🤖 העוזר שלך</h1>

      {/* אזהרה אם אין API key */}
      {!hasAPI && (
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 mb-4">
          <p className="text-sm text-yellow-300">
            ⚠️ <strong>הערה:</strong> עוזר AI בפחות יכול כי אין ANTHROPIC_API_KEY. הוסף אותו ל-.env.local כדי להשתמש בAI מלא.
          </p>
        </div>
      )}

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
