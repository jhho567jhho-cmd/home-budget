'use client'

import { useState, useRef, useEffect } from 'react'
import { ChatMessage } from './components/ChatMessage'
import { ChatInput } from './components/ChatInput'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  expense?: {
    amount: number | null
    category: string
    confidence: number
  }
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '👋 שלום! אני Budget Buddy, עוזרך האישי לניהול תקציב. בואו נעקוב אחרי הוצאותיך בשפה טבעית! 💰',
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [expenses, setExpenses] = useState<any[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (message: string) => {
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()

      // Add assistant message
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        expense: data.expenseData,
      }
      setMessages((prev) => [...prev, assistantMessage])

      // Track expense
      if (data.expenseData.amount) {
        setExpenses((prev) => [
          ...prev,
          {
            id: Date.now(),
            amount: data.expenseData.amount,
            category: data.expenseData.category,
            description: message,
            timestamp: new Date(),
            confidence: data.expenseData.confidence,
          },
        ])
      }
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: '❌ מצטער, קרתה שגיאה. בואו נסו שוב!',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const categories = [...new Set(expenses.map((exp) => exp.category))]

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black">
      {/* Chat Section */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-black/50 backdrop-blur-sm border-b border-purple-500/20 p-6">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            🤖 Budget Buddy
          </h1>
          <p className="text-gray-400 mt-1">עוזר AI חכם לניהול תקציב בעברית</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx}>
              <ChatMessage
                role={msg.role}
                content={msg.content}
                timestamp={msg.timestamp}
              />
              {msg.expense && msg.expense.amount && (
                <div className="flex justify-start mt-2 mb-4">
                  <div className="bg-green-900/30 border border-green-500/50 rounded-lg px-4 py-2 text-sm text-green-300">
                    ✓ {msg.expense.category} • ₪{msg.expense.amount.toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-700 rounded-lg px-4 py-3 typing-indicator">
                <span className="inline-block">💭</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>

      {/* Stats Sidebar */}
      <div className="w-80 bg-black/50 backdrop-blur-sm border-l border-purple-500/20 p-6 overflow-y-auto">
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg p-6">
            <p className="text-gray-200 text-sm mb-2">סך הוצאות</p>
            <p className="text-4xl font-bold">₪{totalExpenses.toFixed(2)}</p>
            <p className="text-gray-300 text-sm mt-2">{expenses.length} הוצאות רשומות</p>
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">קטגוריות</h3>
              <div className="space-y-2">
                {categories.map((cat) => {
                  const catExpenses = expenses.filter((e) => e.category === cat)
                  const catTotal = catExpenses.reduce((sum, e) => sum + e.amount, 0)
                  return (
                    <div
                      key={cat}
                      className="bg-gray-800/50 rounded-lg p-3 flex justify-between items-center hover:bg-gray-800 transition"
                    >
                      <span className="text-gray-300">{cat}</span>
                      <span className="font-semibold text-indigo-400">₪{catTotal.toFixed(2)}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Recent Expenses */}
          {expenses.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">הוצאות אחרונות</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {[...expenses].reverse().slice(0, 5).map((exp) => (
                  <div key={exp.id} className="bg-gray-800/50 rounded-lg p-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">{exp.category}</span>
                      <span className="font-semibold text-green-400">₪{exp.amount.toFixed(2)}</span>
                    </div>
                    <p className="text-gray-500 text-xs mt-1 truncate">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4">
            <p className="text-sm text-blue-200">
              💡 <strong>עצה:</strong> כתוב הוצאות בשפה טבעית כמו "קניתי לחם ב-12 שקל" ו-Buddy יהבין אתכם!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
