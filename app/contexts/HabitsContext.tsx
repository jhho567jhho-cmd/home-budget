'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Habit, DailyHabits } from '../types'

interface HabitsContextType {
  habits: DailyHabits | null
  addHabit: (habit: Habit) => void
  removeHabit: (habitId: string) => void
  toggleHabit: (habitId: string) => void
  getCompletionPercentage: () => number
  getHabitHistory: (habitId: string) => any[]
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined)

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<DailyHabits | null>(null)

  // טעון נתונים מ-localStorage
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const saved = localStorage.getItem(`habits-${today}`)

    if (saved) {
      setHabits(JSON.parse(saved))
    } else {
      // הרגלים ברירת מחדל
      const defaultHabits: Habit[] = [
        {
          id: '1',
          name: 'שתיית מים',
          emoji: '💧',
          category: 'water',
          goal: '8 כוסות',
          completed: false,
          streak: 0,
          completionHistory: []
        },
        {
          id: '2',
          name: 'פעילות גופנית',
          emoji: '🏃',
          category: 'exercise',
          goal: '30 דקות',
          completed: false,
          streak: 0,
          completionHistory: []
        },
        {
          id: '3',
          name: 'שינה',
          emoji: '😴',
          category: 'sleep',
          goal: '8 שעות',
          completed: false,
          streak: 0,
          completionHistory: []
        },
        {
          id: '4',
          name: 'תזונה בריאה',
          emoji: '🥗',
          category: 'nutrition',
          goal: 'ארוחות בריאות',
          completed: false,
          streak: 0,
          completionHistory: []
        }
      ]

      setHabits({
        date: today,
        habits: defaultHabits,
        completionPercentage: 0
      })
    }
  }, [])

  // שמור ל-localStorage בכל שינוי
  useEffect(() => {
    if (habits) {
      const percentage = habits.habits.length > 0
        ? (habits.habits.filter(h => h.completed).length / habits.habits.length) * 100
        : 0

      localStorage.setItem(`habits-${habits.date}`, JSON.stringify({
        ...habits,
        completionPercentage: Math.round(percentage)
      }))
    }
  }, [habits])

  const addHabit = (habit: Habit) => {
    if (!habits) return
    setHabits({
      ...habits,
      habits: [...habits.habits, { ...habit, id: Date.now().toString() }]
    })
  }

  const removeHabit = (habitId: string) => {
    if (!habits) return
    setHabits({
      ...habits,
      habits: habits.habits.filter(h => h.id !== habitId)
    })
  }

  const toggleHabit = (habitId: string) => {
    if (!habits) return

    setHabits({
      ...habits,
      habits: habits.habits.map(h => {
        if (h.id !== habitId) return h

        const newCompleted = !h.completed
        const newStreak = newCompleted ? h.streak + 1 : 0

        return {
          ...h,
          completed: newCompleted,
          streak: newStreak,
          completionHistory: [
            ...h.completionHistory,
            { date: habits.date, completed: newCompleted }
          ]
        }
      })
    })
  }

  const getCompletionPercentage = () => {
    if (!habits || habits.habits.length === 0) return 0
    return Math.round((habits.habits.filter(h => h.completed).length / habits.habits.length) * 100)
  }

  const getHabitHistory = (habitId: string) => {
    if (!habits) return []
    const habit = habits.habits.find(h => h.id === habitId)
    return habit?.completionHistory || []
  }

  return (
    <HabitsContext.Provider
      value={{
        habits,
        addHabit,
        removeHabit,
        toggleHabit,
        getCompletionPercentage,
        getHabitHistory
      }}
    >
      {children}
    </HabitsContext.Provider>
  )
}

export function useHabits() {
  const context = useContext(HabitsContext)
  if (!context) {
    throw new Error('useHabits חייב להיות בתוך HabitsProvider')
  }
  return context
}
