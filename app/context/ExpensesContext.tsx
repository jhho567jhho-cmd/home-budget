'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Expense {
  id: number
  description: string
  amount: number
  category: string
  date: string
  clientId?: string
  clientName?: string
}

interface ExpensesContextType {
  expenses: Expense[]
  addExpense: (expense: Omit<Expense, 'id'>) => void
  deleteExpense: (id: number) => void
  updateExpense: (id: number, expense: Partial<Expense>) => void
  getMonthlyExpenses: (month: number, year: number) => Expense[]
  getTotalMonthlySpending: (month: number, year: number) => number
  getCategoryBreakdown: (month: number, year: number) => Record<string, number>
  getClientExpenses: (clientId: string) => Expense[]
  getClientTotalSpending: (clientId: string) => number
  getClientsBreakdown: () => Record<string, number>
}

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined)

export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, description: 'קניות במכולת', amount: 150, category: 'קניות', date: '2026-09-17' },
    { id: 2, description: 'חשמל', amount: 200, category: 'שירותים', date: '2026-09-15' },
  ])

  useEffect(() => {
    const saved = localStorage.getItem('expenses')
    if (saved) {
      setExpenses(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Math.max(...expenses.map((e) => e.id), 0) + 1,
    }
    setExpenses([...expenses, newExpense])
  }

  const deleteExpense = (id: number) => {
    setExpenses(expenses.filter((e) => e.id !== id))
  }

  const updateExpense = (id: number, updates: Partial<Expense>) => {
    setExpenses(expenses.map((e) => (e.id === id ? { ...e, ...updates } : e)))
  }

  const getMonthlyExpenses = (month: number, year: number) => {
    return expenses.filter((e) => {
      const expDate = new Date(e.date)
      return expDate.getMonth() === month && expDate.getFullYear() === year
    })
  }

  const getTotalMonthlySpending = (month: number, year: number) => {
    return getMonthlyExpenses(month, year).reduce((sum, e) => sum + e.amount, 0)
  }

  const getCategoryBreakdown = (month: number, year: number) => {
    const breakdown: Record<string, number> = {}
    getMonthlyExpenses(month, year).forEach((e) => {
      breakdown[e.category] = (breakdown[e.category] || 0) + e.amount
    })
    return breakdown
  }

  const getClientExpenses = (clientId: string) => {
    return expenses.filter((e) => e.clientId === clientId)
  }

  const getClientTotalSpending = (clientId: string) => {
    return getClientExpenses(clientId).reduce((sum, e) => sum + e.amount, 0)
  }

  const getClientsBreakdown = () => {
    const breakdown: Record<string, number> = {}
    expenses.forEach((e) => {
      if (e.clientName) {
        breakdown[e.clientName] = (breakdown[e.clientName] || 0) + e.amount
      }
    })
    return breakdown
  }

  return (
    <ExpensesContext.Provider
      value={{
        expenses,
        addExpense,
        deleteExpense,
        updateExpense,
        getMonthlyExpenses,
        getTotalMonthlySpending,
        getCategoryBreakdown,
        getClientExpenses,
        getClientTotalSpending,
        getClientsBreakdown,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  )
}

export function useExpenses() {
  const context = useContext(ExpensesContext)
  if (!context) {
    throw new Error('useExpenses must be used within ExpensesProvider')
  }
  return context
}
