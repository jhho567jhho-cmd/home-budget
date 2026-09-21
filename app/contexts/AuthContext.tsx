'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface User {
  id: string
  name: string
  createdAt: Date
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (name: string) => void
  logout: () => void
  generateUserId: (name: string) => string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // טעון משתמש מ-localStorage
  useEffect(() => {
    const saved = localStorage.getItem('app-user')
    if (saved) {
      try {
        const userData = JSON.parse(saved)
        setUser(userData)
      } catch (e) {
        console.error('שגיאה בטעינת משתמש:', e)
      }
    }
    setIsLoading(false)
  }, [])

  const generateUserId = (name: string): string => {
    // ID ייחודי בסיס על השם ותאריך
    const timestamp = Date.now()
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
    localStorage.setItem('app-user', JSON.stringify(newUser))
  }

  const logout = () => {
    // מחק את כל הנתונים של המשתמש
    if (user) {
      localStorage.removeItem(`meals-${user.id}`)
      localStorage.removeItem(`habits-${user.id}`)
      localStorage.removeItem(`profile-${user.id}`)
      localStorage.removeItem(`conversation-${user.id}`)
      localStorage.removeItem('app-user')
    }
    setUser(null)
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
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, generateUserId }}>
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
