'use client'

import { useState, useEffect } from 'react'
import Login from './components/Login'
import Home from './pages/home'
import { ClientsProvider } from './context/ClientsContext'
import { MeetingsProvider } from './context/MeetingsContext'
import { TasksProvider } from './context/TasksContext'
import { NotesProvider } from './context/NotesContext'
import { ConversationProvider } from './context/ConversationContext'
import { KnowledgeProvider } from './context/KnowledgeContext'
import { ExpensesProvider } from './context/ExpensesContext'
import { JournalProvider } from './context/JournalContext'

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
    <JournalProvider>
      <ExpensesProvider>
        <ClientsProvider>
          <MeetingsProvider>
            <TasksProvider>
              <NotesProvider>
                <ConversationProvider>
                  <KnowledgeProvider>
                    <Home userEmail={userEmail} onLogout={handleLogout} />
                  </KnowledgeProvider>
                </ConversationProvider>
              </NotesProvider>
            </TasksProvider>
          </MeetingsProvider>
        </ClientsProvider>
      </ExpensesProvider>
    </JournalProvider>
  ) : (
    <Login onLogin={handleLogin} />
  )
}
