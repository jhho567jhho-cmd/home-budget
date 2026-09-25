'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface HealthEntry {
  id: number
  note: string
  value: number
  type: string
  unit: string
  date: string
}

interface HealthContextType {
  entries: HealthEntry[]
  addEntry: (entry: Omit<HealthEntry, 'id'>) => void
  deleteEntry: (id: number) => void
  updateEntry: (id: number, entry: Partial<HealthEntry>) => void
  getMonthlyEntries: (month: number, year: number) => HealthEntry[]
  getEntresByType: (type: string) => HealthEntry[]
  getTypeBreakdown: (month: number, year: number) => Record<string, number>
}

const HealthContext = createContext<HealthContextType | undefined>(undefined)

export function HealthProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<HealthEntry[]>([
    { id: 1, note: 'בוקר - יוגה', value: 30, type: 'פעילות', unit: 'דקות', date: '2026-09-21' },
    { id: 2, note: 'ארוחת בוקר - ביצים וגרנולה', value: 350, type: 'תזונה', unit: 'קלוריות', date: '2026-09-21' },
  ])

  useEffect(() => {
    const saved = localStorage.getItem('healthEntries')
    if (saved) {
      setEntries(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('healthEntries', JSON.stringify(entries))
  }, [entries])

  const addEntry = (entry: Omit<HealthEntry, 'id'>) => {
    const newEntry: HealthEntry = {
      ...entry,
      id: Math.max(...entries.map((e) => e.id), 0) + 1,
    }
    setEntries([...entries, newEntry])
  }

  const deleteEntry = (id: number) => {
    setEntries(entries.filter((e) => e.id !== id))
  }

  const updateEntry = (id: number, updates: Partial<HealthEntry>) => {
    setEntries(entries.map((e) => (e.id === id ? { ...e, ...updates } : e)))
  }

  const getMonthlyEntries = (month: number, year: number) => {
    return entries.filter((e) => {
      const entryDate = new Date(e.date)
      return entryDate.getMonth() === month && entryDate.getFullYear() === year
    })
  }

  const getEntresByType = (type: string) => {
    return entries.filter((e) => e.type === type)
  }

  const getTypeBreakdown = (month: number, year: number) => {
    const breakdown: Record<string, number> = {}
    getMonthlyEntries(month, year).forEach((e) => {
      breakdown[e.type] = (breakdown[e.type] || 0) + e.value
    })
    return breakdown
  }

  return (
    <HealthContext.Provider
      value={{
        entries,
        addEntry,
        deleteEntry,
        updateEntry,
        getMonthlyEntries,
        getEntresByType,
        getTypeBreakdown,
      }}
    >
      {children}
    </HealthContext.Provider>
  )
}

export function useHealth() {
  const context = useContext(HealthContext)
  if (!context) {
    throw new Error('useHealth must be used within HealthProvider')
  }
  return context
}

// Keep backwards compatibility
export function useExpenses() {
  return useHealth()
}

export const ExpensesProvider = HealthProvider
