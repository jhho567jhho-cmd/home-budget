'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Message } from '../types'
import { useAuth } from './AuthContext'
import { getMessages as getSupabaseMessages, addMessage as addSupabaseMessage } from '../lib/supabase'

interface ConversationContextType {
  messages: Message[]
  addMessage: (content: string, role: 'user' | 'assistant') => void
  clearMessages: () => void
  getMessages: () => Message[]
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined)

export function ConversationProvider({ children }: { children: React.ReactNode }) {
  const { user, useSupabase } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadMessages = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        if (useSupabase) {
          const supabaseMessages = await getSupabaseMessages(user.id)
          setMessages(supabaseMessages.map(m => ({
            id: m.id,
            role: m.role,
            content: m.content,
            timestamp: new Date(m.created_at)
          })))
        } else {
          const storageKey = `conversation-${user.id}`
          const saved = localStorage.getItem(storageKey)
          if (saved) {
            setMessages(JSON.parse(saved))
          }
        }
      } catch (e) {
        console.error('Error loading messages:', e)
      }

      setIsLoading(false)
    }

    loadMessages()
  }, [user, useSupabase])

  useEffect(() => {
    if (user && !useSupabase) {
      const storageKey = `conversation-${user.id}`
      localStorage.setItem(storageKey, JSON.stringify(messages))
    }
  }, [messages, user, useSupabase])

  const addMessage = async (content: string, role: 'user' | 'assistant') => {
    if (!user) return

    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date()
    }

    try {
      if (useSupabase) {
        const savedMessage = await addSupabaseMessage(user.id, role, content)
        if (savedMessage) {
          newMessage.id = savedMessage.id
          newMessage.timestamp = new Date(savedMessage.created_at)
        }
      }
      setMessages([...messages, newMessage])
    } catch (e) {
      console.error('Error adding message:', e)
      setMessages([...messages, newMessage])
    }
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
