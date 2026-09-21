'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Message } from '../types'
import { useAuth } from './AuthContext'

interface ConversationContextType {
  messages: Message[]
  addMessage: (content: string, role: 'user' | 'assistant') => void
  clearMessages: () => void
  getMessages: () => Message[]
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined)

export function ConversationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    if (!user) return
    const storageKey = `conversation-${user.id}`
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      setMessages(JSON.parse(saved))
    }
  }, [user])

  useEffect(() => {
    if (user) {
      const storageKey = `conversation-${user.id}`
      localStorage.setItem(storageKey, JSON.stringify(messages))
    }
  }, [messages, user])

  const addMessage = (content: string, role: 'user' | 'assistant') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date()
    }
    setMessages([...messages, newMessage])
  }

  const clearMessages = () => {
    setMessages([])
  }

  const getMessages = () => messages

  return (
    <ConversationContext.Provider value={{ messages, addMessage, clearMessages, getMessages }}>
      {children}
    </ConversationContext.Provider>
  )
}

export function useConversation() {
  const context = useContext(ConversationContext)
  if (!context) {
    throw new Error('useConversation חייב להיות בתוך ConversationProvider')
  }
  return context
}
