'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Habit, DailyHabits } from '../types'
import { useAuth } from './AuthContext'
import { getHabits as getSupabaseHabits, addHabit as addSupabaseHabit, deleteHabit, updateHabit as updateSupabaseHabit } from '../lib/supabase'

interface HabitsContextType {
  habits: DailyHabits | null
  addHabit: (habit: Habit) => void
  removeHabit: (habitId: string) => void
  toggleHabit: (habitId: string) => void
  getCompletionPercentage: () => number
  getHabitHistory: (habitId: string) => any[]
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined)

const DEFAULT_HABITS: Habit[] = [
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

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const { user, useSupabase } = useAuth()
  const [habits, setHabits] = useState<DailyHabits | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load habits from Supabase or localStorage
  useEffect(() => {
    const loadHabits = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }

      const today = new Date().toISOString().split('T')[0]

      try {
        if (useSupabase) {
          const supabaseHabits = await getSupabaseHabits(user.id)
          if (supabaseHabits.length === 0) {
            // Create default habits
            setHabits({
              date: today,
              habits: DEFAULT_HABITS,
              completionPercentage: 0
            })
          } else {
            setHabits({
              date: today,
              habits: supabaseHabits.map(h => ({
                id: h.id,
                name: h.name,
                emoji: h.emoji,
                category: h.category,
                goal: '',
                completed: h.completed,
                streak: h.streak,
                completionHistory: []
              })),
              completionPercentage: 0
            })
          }
        } else {
          const storageKey = `habits-${user.id}-${today}`
          const saved = localStorage.getItem(storageKey)

          if (saved) {
            setHabits(JSON.parse(saved))
          } else {
            setHabits({
              date: today,
              habits: DEFAULT_HABITS,
              completionPercentage: 0
            })
          }
        }
      } catch (e) {
        console.error('Error loading habits:', e)
        setHabits({
          date: today,
          habits: DEFAULT_HABITS,
          completionPercentage: 0
        })
      }

      setIsLoading(false)
    }

    loadHabits()
  }, [user, useSupabase])

  // Save to localStorage when not using Supabase
  useEffect(() => {
    if (habits && user && !useSupabase) {
      const percentage = habits.habits.length > 0
        ? (habits.habits.filter(h => h.completed).length / habits.habits.length) * 100
        : 0

      const storageKey = `habits-${user.id}-${habits.date}`
      localStorage.setItem(storageKey, JSON.stringify({
        ...habits,
        completionPercentage: Math.round(percentage)
      }))
    }
  }, [habits, user, useSupabase])

  const addHabit = async (habit: Habit) => {
    if (!habits || !user) return

    try {
      if (useSupabase) {
        const newHabit = await addSupabaseHabit(user.id, habit)
        if (newHabit) {
          setHabits({
            ...habits,
            habits: [...habits.habits, {
              id: newHabit.id,
              name: newHabit.name,
              emoji: newHabit.emoji,
              category: newHabit.category,
              goal: '',
              completed: newHabit.completed,
              streak: newHabit.streak,
              completionHistory: []
            }]
          })
        }
      } else {
        setHabits({
          ...habits,
          habits: [...habits.habits, { ...habit, id: Date.now().toString() }]
        })
      }
    } catch (e) {
      console.error('Error adding habit:', e)
    }
  }

  const removeHabit = async (habitId: string) => {
    if (!habits) return

    try {
      if (useSupabase) {
        await deleteHabit(habitId)
      }
      setHabits({
        ...habits,
        habits: habits.habits.filter(h => h.id !== habitId)
      })
    } catch (e) {
      console.error('Error removing habit:', e)
    }
  }

  const toggleHabit = async (habitId: string) => {
    if (!habits) return

    const habitToToggle = habits.habits.find(h => h.id === habitId)
    if (!habitToToggle) return

    const newCompleted = !habitToToggle.completed
    const newStreak = newCompleted ? habitToToggle.streak + 1 : 0

    try {
      if (useSupabase) {
        await updateSupabaseHabit(habitId, {
          completed: newCompleted,
          streak: newStreak,
          last_completed_date: newCompleted ? new Date().toISOString().split('T')[0] : null
        })
      }

      setHabits({
        ...habits,
        habits: habits.habits.map(h => {
          if (h.id !== habitId) return h
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
    } catch (e) {
      console.error('Error toggling habit:', e)
    }
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
