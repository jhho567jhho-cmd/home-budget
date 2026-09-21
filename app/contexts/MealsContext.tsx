'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { DailyMeals, Meal } from '../types'
import { useAuth } from './AuthContext'
import { getMealsByDate as getSupabaseMeals, addMeal as addSupabaseMeal, deleteMeal, updateMeal as updateSupabaseMeal } from '../lib/supabase'

interface MealsContextType {
  meals: DailyMeals | null
  addMeal: (meal: Meal) => void
  removeMeal: (mealId: string) => void
  toggleMeal: (mealId: string) => void
  getMealsByDate: (date: string) => Meal[]
  updateMeal: (mealId: string, meal: Partial<Meal>) => void
}

const MealsContext = createContext<MealsContextType | undefined>(undefined)

export function MealsProvider({ children }: { children: React.ReactNode }) {
  const { user, useSupabase } = useAuth()
  const [meals, setMeals] = useState<DailyMeals | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load meals from Supabase or localStorage
  useEffect(() => {
    const loadMeals = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }

      const today = new Date().toISOString().split('T')[0]

      try {
        if (useSupabase) {
          const supabaseMeals = await getSupabaseMeals(user.id, today)
          setMeals({
            date: today,
            meals: supabaseMeals.map(m => ({
              id: m.id,
              name: m.name,
              time: m.time,
              type: m.type,
              calories: m.calories,
              notes: m.notes,
              completed: m.completed,
              ingredients: m.ingredients || []
            }))
          })
        } else {
          const storageKey = `meals-${user.id}-${today}`
          const saved = localStorage.getItem(storageKey)
          if (saved) {
            setMeals(JSON.parse(saved))
          } else {
            setMeals({
              date: today,
              meals: []
            })
          }
        }
      } catch (e) {
        console.error('Error loading meals:', e)
        setMeals({
          date: today,
          meals: []
        })
      }

      setIsLoading(false)
    }

    loadMeals()
  }, [user, useSupabase])

  // Save to localStorage when not using Supabase
  useEffect(() => {
    if (meals && user && !useSupabase) {
      const storageKey = `meals-${user.id}-${meals.date}`
      localStorage.setItem(storageKey, JSON.stringify(meals))
    }
  }, [meals, user, useSupabase])

  const addMeal = async (meal: Meal) => {
    if (!meals || !user) return

    try {
      if (useSupabase) {
        const newMeal = await addSupabaseMeal(user.id, meal)
        if (newMeal) {
          setMeals({
            ...meals,
            meals: [...meals.meals, {
              id: newMeal.id,
              name: newMeal.name,
              time: newMeal.time,
              type: newMeal.type,
              calories: newMeal.calories,
              notes: newMeal.notes,
              completed: newMeal.completed,
              ingredients: newMeal.ingredients || []
            }]
          })
        }
      } else {
        setMeals({
          ...meals,
          meals: [...meals.meals, { ...meal, id: Date.now().toString() }]
        })
      }
    } catch (e) {
      console.error('Error adding meal:', e)
    }
  }

  const removeMeal = async (mealId: string) => {
    if (!meals || !user) return

    try {
      if (useSupabase) {
        await deleteMeal(mealId)
      }
      setMeals({
        ...meals,
        meals: meals.meals.filter(m => m.id !== mealId)
      })
    } catch (e) {
      console.error('Error removing meal:', e)
    }
  }

  const toggleMeal = async (mealId: string) => {
    if (!meals) return

    const mealToUpdate = meals.meals.find(m => m.id === mealId)
    if (!mealToUpdate) return

    try {
      if (useSupabase) {
        await updateSupabaseMeal(mealId, { completed: !mealToUpdate.completed })
      }
      setMeals({
        ...meals,
        meals: meals.meals.map(m =>
          m.id === mealId ? { ...m, completed: !m.completed } : m
        )
      })
    } catch (e) {
      console.error('Error toggling meal:', e)
    }
  }

  const getMealsByDate = (date: string) => {
    if (!meals || meals.date !== date) return []
    return meals.meals
  }

  const updateMeal = async (mealId: string, mealUpdate: Partial<Meal>) => {
    if (!meals) return

    try {
      if (useSupabase) {
        await updateSupabaseMeal(mealId, mealUpdate)
      }
      setMeals({
        ...meals,
        meals: meals.meals.map(m =>
          m.id === mealId ? { ...m, ...mealUpdate } : m
        )
      })
    } catch (e) {
      console.error('Error updating meal:', e)
    }
  }

  return (
    <MealsContext.Provider value={{ meals, addMeal, removeMeal, toggleMeal, getMealsByDate, updateMeal }}>
      {children}
    </MealsContext.Provider>
  )
}

export function useMeals() {
  const context = useContext(MealsContext)
  if (!context) {
    throw new Error('useMeals חייב להיות בתוך MealsProvider')
  }
  return context
}
