'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface JournalEntry {
  id: string
  date: string
  content: string
  mood: 'great' | 'good' | 'okay' | 'bad'
  title: string
  createdAt: string
}

interface JournalContextType {
  entries: JournalEntry[]
  addEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void
  deleteEntry: (id: string) => void
  updateEntry: (id: string, entry: Partial<JournalEntry>) => void
  getEntryByDate: (date: string) => JournalEntry | undefined
  getTodayEntry: () => JournalEntry | undefined
  getMonthEntries: (month: number, year: number) => JournalEntry[]
}

const JournalContext = createContext<JournalContextType | undefined>(undefined)

export function JournalProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<JournalEntry[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('journalEntries')
    if (saved) {
      setEntries(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(entries))
  }, [entries])

  const addEntry = (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: `journal-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setEntries([newEntry, ...entries])
  }

  const deleteEntry = (id: string) => {
    setEntries(entries.filter((e) => e.id !== id))
  }

  const updateEntry = (id: string, updates: Partial<JournalEntry>) => {
    setEntries(entries.map((e) => (e.id === id ? { ...e, ...updates } : e)))
  }

  const getEntryByDate = (date: string) => {
    return entries.find((e) => e.date === date)
  }

  const getTodayEntry = () => {
    const today = new Date().toISOString().split('T')[0]
    return getEntryByDate(today)
  }

  const getMonthEntries = (month: number, year: number) => {
    return entries.filter((e) => {
      const entryDate = new Date(e.date)
      return entryDate.getMonth() === month && entryDate.getFullYear() === year
    })
  }

  return (
    <JournalContext.Provider
      value={{
        entries,
        addEntry,
        deleteEntry,
        updateEntry,
        getEntryByDate,
        getTodayEntry,
        getMonthEntries,
      }}
    >
      {children}
    </JournalContext.Provider>
  )
}

export function useJournal() {
  const context = useContext(JournalContext)
  if (!context) {
    throw new Error('useJournal must be used within JournalProvider')
  }
  return context
}
