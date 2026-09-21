'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase, getCurrentUser, signOutUser } from '../lib/supabase'

export interface User {
  id: string
  name: string
  email?: string
  createdAt: Date
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (name: string) => void
  logout: () => void
  generateUserId: (name: string) => string
  useSupabase: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [useSupabase, setUseSupabase] = useState(false)

  // Load user from Supabase or localStorage
  useEffect(() => {
    const loadUser = async () => {
      try {
        if (supabase) {
          const supabaseUser = await getCurrentUser()
          if (supabaseUser) {
            setUser({
              id: supabaseUser.id,
              name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'משתמש',
              email: supabaseUser.email,
              createdAt: new Date(supabaseUser.created_at)
            })
            setUseSupabase(true)
            setIsLoading(false)
            return
          }
        }
      } catch (e) {
        console.error('Supabase auth error:', e)
      }

      // Fallback to localStorage
      const saved = localStorage.getItem('app-user')
      if (saved) {
        try {
          const userData = JSON.parse(saved)
          setUser(userData)
          setUseSupabase(false)
        } catch (e) {
          console.error('Error loading user from localStorage:', e)
        }
      }
      setIsLoading(false)
    }

    loadUser()
  }, [])

  const generateUserId = (name: string): string => {
    const randomPart = Math.random().toString(36).substring(2, 9)
    return `${name.toLowerCase().replace(/\s+/g, '-')}-${randomPart}`
  }

  const login = (name: string) => {
    if (!name.trim()) return

    const newUser: User = {
      id: generateUserId(name),
      name: name.trim(),
      createdAt: new Date()
    }

    setUser(newUser)
    setUseSupabase(false)
    localStorage.setItem('app-user', JSON.stringify(newUser))
  }

  const logout = async () => {
    if (!user) return

    // Clear Supabase session
    if (useSupabase && supabase) {
      try {
        await signOutUser()
      } catch (e) {
        console.error('Error signing out from Supabase:', e)
      }
    }

    // Clear localStorage
    localStorage.removeItem(`meals-${user.id}`)
    localStorage.removeItem(`meals-${user.id}-${new Date().toISOString().split('T')[0]}`)
    localStorage.removeItem(`habits-${user.id}`)
    localStorage.removeItem(`profile-${user.id}`)
    localStorage.removeItem(`conversation-${user.id}`)
    localStorage.removeItem('app-user')

    setUser(null)
    setUseSupabase(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">⏳</div>
          <p className="text-slate-300">טוען...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, generateUserId, useSupabase }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth חייב להיות בתוך AuthProvider')
  }
  return context
}
