'use client'

import { useState, useEffect } from 'react'
import Login from './components/Login'
import Home from './pages/home'
import { ClientsProvider } from './context/ClientsContext'
import { MeetingsProvider } from './context/MeetingsContext'
import { TasksProvider } from './context/TasksContext'
import { NotesProvider } from './context/NotesContext'

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // בדוק אם יש משתמש שמור
  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail')
    if (savedEmail) {
      setUserEmail(savedEmail)
      setIsLoggedIn(true)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (email: string) => {
    setUserEmail(email)
    setIsLoggedIn(true)
    localStorage.setItem('userEmail', email)
  }

  const handleLogout = () => {
    setUserEmail('')
    setIsLoggedIn(false)
    localStorage.removeItem('userEmail')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">🧠</div>
          <p className="text-slate-600">טוען...</p>
        </div>
      </div>
    )
  }

  return isLoggedIn ? (
    <ClientsProvider>
      <MeetingsProvider>
        <TasksProvider>
          <NotesProvider>
            <Home userEmail={userEmail} onLogout={handleLogout} />
          </NotesProvider>
        </TasksProvider>
      </MeetingsProvider>
    </ClientsProvider>
  ) : (
    <Login onLogin={handleLogin} />
  )
}
