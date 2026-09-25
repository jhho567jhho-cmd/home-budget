'use client'

import { useEffect, useRef } from 'react'
import { useConversation } from '@/app/context/ConversationContext'
import { useHealth } from '@/app/context/ExpensesContext'
import { useTasks } from '@/app/context/TasksContext'
import { aiService } from '@/app/services/aiService'

const QUICK_ACTIONS = [
  { id: 'today', label: '📊 סיכום בריאות היום', message: 'סכם לי את רישומי הבריאות של היום' },
  {
    id: 'goals',
    label: '🎯 יעדים שלי',
    message: 'מה היעדים הבריאותיים שלי?',
  },
  {
    id: 'activity',
    label: '💪 פעילות גופנית',
    message: 'כמה פעילות גופנית עשיתי השבוע?',
  },
  {
    id: 'nutrition',
    label: '🥗 תזונה',
    message: 'מה אכלתי היום ודיברנו על הבחירות שלי?',
  },
  {
    id: 'sleep',
    label: '😴 איכות שינה',
    message: 'כיצד אני יכול לשפר את איכות השינה שלי?',
  },
]

export default function AIScreen() {
  const { messages, addMessage, isLoading, setIsLoading, clearMessages } =
    useConversation()
  const { entries } = useHealth()
  const { tasks } = useTasks()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // גלילה אוטומטית
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputRef.current?.value.trim() || isLoading) return

    const userMessage = inputRef.current.value
    inputRef.current.value = ''

    // הוסף הודעת משתמש
    addMessage('user', userMessage)
    setIsLoading(true)

    try {
      // שלח ל-AI service
      const aiResponse = await aiService.sendMessage(userMessage, {
        entries,
        tasks,
      })

      // הוסף תגובת AI
      addMessage('assistant', aiResponse.content)
    } catch (error) {
      console.error('שגיאה בשליחה:', error)
      addMessage('assistant', 'שגיאה בקבלת תגובה. אנא נסה שוב.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = async (message: string) => {
    inputRef.current?.focus()
    if (isLoading) return

    // הוסף הודעת משתמש
    addMessage('user', message)
    setIsLoading(true)

    try {
      // שלח ל-AI service
      const aiResponse = await aiService.sendMessage(message, {
        entries,
        tasks,
      })

      // הוסף תגובת AI
      addMessage('assistant', aiResponse.content)
    } catch (error) {
      console.error('שגיאה בשליחה:', error)
      addMessage('assistant', 'שגיאה בקבלת תגובה. אנא נסה שוב.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 px-4 py-4 z-10 shadow-lg">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={clearMessages}
            className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded transition"
          >
            ✕ נקה
          </button>
          <h1 className="text-2xl font-bold text-white">🤖 העוזרת שלי</h1>
          <div></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-6 max-w-2xl mx-auto w-full">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            {/* Welcome Message */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🧠</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                שלום דבורה! אני כאן לעזור לך
              </h2>
              <p className="text-gray-400">
                בחר פעולה מהירה או כתוב לי משהו
              </p>
            </div>

            {/* Quick Actions */}
            <div className="w-full space-y-2">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action.message)}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-br from-blue-600 to-purple-600 border border-blue-500 rounded-lg p-4 text-right text-white hover:opacity-90 transition disabled:opacity-50 font-semibold"
                >
                  <div>
                    {action.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg text-sm whitespace-pre-wrap ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-slate-800 text-gray-100 rounded-bl-none border border-slate-700'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 border border-slate-700 rounded-lg rounded-bl-none px-4 py-3">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 bg-gradient-to-r from-slate-800 to-slate-900 border-t border-slate-700 px-4 py-4 shadow-lg">
        <div className="max-w-2xl mx-auto">
          {/* Show quick actions if not many messages */}
          {messages.length > 0 && messages.length < 5 && (
            <div className="mb-3 grid grid-cols-2 gap-2">
              {QUICK_ACTIONS.slice(0, 4).map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action.message)}
                  disabled={isLoading}
                  className="text-xs bg-slate-700 hover:bg-slate-600 border border-blue-500 text-blue-200 px-2 py-1 rounded transition disabled:opacity-50 font-semibold"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Input form */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <button
              type="button"
              className="bg-slate-700 hover:bg-slate-600 text-blue-400 p-3 rounded-lg transition disabled:opacity-50"
              disabled={isLoading}
              title="רשם קול (בקרוב)"
            >
              🎙️
            </button>
            <input
              ref={inputRef}
              type="text"
              placeholder="כתוב הודעה..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 text-right disabled:opacity-50"
              dir="rtl"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white px-4 py-3 rounded-lg transition disabled:opacity-50 font-semibold"
            >
              {isLoading ? '⏳' : '➤'}
            </button>
          </form>

          {/* Info message */}
          <p className="text-xs text-gray-500 mt-2 text-center">
            ✨ מופעל על ידי Claude AI
          </p>
        </div>
      </div>
    </div>
  )
}
