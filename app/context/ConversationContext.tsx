'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { AIMessage } from '@/app/services/aiService'

interface ConversationContextType {
  messages: AIMessage[]
  addMessage: (role: 'user' | 'assistant', content: string) => void
  clearMessages: () => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined)

const STORAGE_KEY = 'nlp-coach-conversation'

export function ConversationProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // טען מ-localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setMessages(JSON.parse(stored))
      }
    } catch (error) {
      console.error('שגיאה בטעינת שיחה:', error)
    }
    setIsMounted(true)
  }, [])

  // שמור ל-localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    }
  }, [messages, isMounted])

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    const newMessage: AIMessage = {
      role,
      content,
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const clearMessages = () => {
    setMessages([])
  }

  return (
    <ConversationContext.Provider
      value={{
        messages,
        addMessage,
        clearMessages,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </ConversationContext.Provider>
  )
}

export function useConversation() {
  const context = useContext(ConversationContext)
  if (!context) {
    throw new Error('useConversation must be used within ConversationProvider')
  }
  return context
}
