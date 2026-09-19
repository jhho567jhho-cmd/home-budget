'use client'

import { useEffect, useRef } from 'react'
import { useConversation } from '@/app/context/ConversationContext'
import { useClients } from '@/app/context/ClientsContext'
import { useMeetings } from '@/app/context/MeetingsContext'
import { useTasks } from '@/app/context/TasksContext'
import { aiService } from '@/app/services/aiService'

const QUICK_ACTIONS = [
  { id: 'today', label: '📋 מה יש לי היום?', message: 'מה יש לי היום?' },
  {
    id: 'followup',
    label: '⚠️ לקוחות דורשים מעקב',
    message: 'אילו לקוחות דורשים מעקב?',
  },
  {
    id: 'summary',
    label: '📊 סכם לי את הפגישות',
    message: 'סכם לי את הפגישות של היום',
  },
  {
    id: 'tasks',
    label: '✓ משימות פתוחות',
    message: 'הצג משימות פתוחות',
  },
  {
    id: 'new-clients',
    label: '👤 לקוחות חדשים',
    message: 'הצג לקוחות ללא מעקב',
  },
]

export default function AIScreen() {
  const { messages, addMessage, isLoading, setIsLoading, clearMessages } =
    useConversation()
  const { clients } = useClients()
  const { meetings } = useMeetings()
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
      // שלח ל-AI service (כרגע mock)
      const aiResponse = await aiService.sendMessage(userMessage, {
        clients,
        meetings,
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
        clients,
        meetings,
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
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-4 z-10">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={clearMessages}
            className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded hover:bg-slate-300"
          >
            ✕ נקה
          </button>
          <h1 className="text-2xl font-bold text-slate-800">🤖 העוזרת שלי</h1>
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
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                שלום! אני כאן לעזור לך
              </h2>
              <p className="text-slate-600">
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
                  className="w-full bg-white border border-slate-300 rounded-lg p-4 text-right hover:bg-indigo-50 transition disabled:opacity-50"
                >
                  <div className="font-semibold text-slate-800">
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
                  message.role === 'user' ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg text-sm whitespace-pre-wrap ${
                    message.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-bl-none'
                      : 'bg-white text-slate-800 rounded-br-none border border-slate-300'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-end">
                <div className="bg-white border border-slate-300 rounded-lg rounded-br-none px-4 py-3">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
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
      <div className="sticky bottom-0 bg-white border-t border-slate-200 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          {/* Show quick actions if not many messages */}
          {messages.length > 0 && messages.length < 5 && (
            <div className="mb-3 grid grid-cols-2 gap-2">
              {QUICK_ACTIONS.slice(0, 4).map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action.message)}
                  disabled={isLoading}
                  className="text-xs bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-100 transition disabled:opacity-50"
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
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 p-3 rounded-lg transition disabled:opacity-50"
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
              className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-right disabled:opacity-50"
              dir="rtl"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg transition disabled:opacity-50"
            >
              {isLoading ? '⏳' : '➤'}
            </button>
          </form>

          {/* Info message */}
          <p className="text-xs text-slate-500 mt-2 text-center">
            ✨ זה עדיין mock. בקרוב אחובר ל-AI אמיתי.
          </p>
        </div>
      </div>
    </div>
  )
}
