'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { DailyMeals, Meal } from '../types'
import { useAuth } from './AuthContext'

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
  const { user } = useAuth()
  const [meals, setMeals] = useState<DailyMeals | null>(null)

  useEffect(() => {
    if (!user) return

    const today = new Date().toISOString().split('T')[0]
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
  }, [user])

  useEffect(() => {
    if (meals && user) {
      const storageKey = `meals-${user.id}-${meals.date}`
      localStorage.setItem(storageKey, JSON.stringify(meals))
    }
  }, [meals, user])

  const addMeal = (meal: Meal) => {
    if (!meals) return
    setMeals({
      ...meals,
      meals: [...meals.meals, { ...meal, id: Date.now().toString() }]
    })
  }

  const removeMeal = (mealId: string) => {
    if (!meals) return
    setMeals({
      ...meals,
      meals: meals.meals.filter(m => m.id !== mealId)
    })
  }

  const toggleMeal = (mealId: string) => {
    if (!meals) return
    setMeals({
      ...meals,
      meals: meals.meals.map(m =>
        m.id === mealId ? { ...m, completed: !m.completed } : m
      )
    })
  }

  const getMealsByDate = (date: string) => {
    if (!meals || meals.date !== date) return []
    return meals.meals
  }

  const updateMeal = (mealId: string, mealUpdate: Partial<Meal>) => {
    if (!meals) return
    setMeals({
      ...meals,
      meals: meals.meals.map(m =>
        m.id === mealId ? { ...m, ...mealUpdate } : m
      )
    })
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
