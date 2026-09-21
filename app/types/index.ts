// טיפוסים עיקריים ל-LifeBalance

export interface Meal {
  id: string
  name: string
  time: string // HH:mm
  ingredients?: string[]
  calories?: number
  notes?: string
  completed: boolean
  type: 'breakfast' | 'snack' | 'lunch' | 'dinner'
}

export interface DailyMeals {
  date: string // YYYY-MM-DD
  meals: Meal[]
}

export interface Habit {
  id: string
  name: string
  emoji: string
  category: 'water' | 'exercise' | 'sleep' | 'nutrition' | 'custom'
  goal?: string // יעד יומי
  completed: boolean
  streak: number // רצף ימים
  completionHistory: {
    date: string // YYYY-MM-DD
    completed: boolean
  }[]
}

export interface DailyHabits {
  date: string // YYYY-MM-DD
  habits: Habit[]
  completionPercentage: number
}

export interface UserProfile {
  name: string
  email: string
  preferences: {
    mealTimes: {
      breakfast: string // HH:mm
      snack: string
      lunch: string
      dinner: string
    }
    allergies?: string[]
    dislikedFoods?: string[]
    dietaryRestrictions?: string[]
    sleepGoal: number // שעות
    waterGoal: number // כוסות
    customHabits: string[]
  }
}

export interface DayStats {
  date: string // YYYY-MM-DD
  mealsPlanned: number
  mealsCompleted: number
  habitsCompleted: number
  totalHabits: number
  progressPercentage: number
}

export interface WeeklyStats {
  weekStart: string // YYYY-MM-DD
  days: DayStats[]
  averageCompletion: number
  habitsStreak: number
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  action?: {
    type: string
    payload?: any
  }
}
