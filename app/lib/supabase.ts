import { createClient } from '@supabase/supabase-js'
import { Meal, Habit, DailyMeals } from '../types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const isConfigured = !!(supabaseUrl && supabaseAnonKey)

if (!isConfigured) {
  console.warn('⚠️ Supabase credentials missing. Using localStorage fallback.')
}

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

export async function isSupabaseEnabled(): Promise<boolean> {
  if (!supabase) return false
  try {
    const { error } = await supabase.auth.getUser()
    return !error
  } catch {
    return false
  }
}

// Auth functions
export async function signUpUser(email: string, password: string, name: string) {
  if (!supabase) throw new Error('Supabase not configured')

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  })

  if (error) throw error
  return data
}

export async function signInUser(email: string, password: string) {
  if (!supabase) throw new Error('Supabase not configured')

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error
  return data
}

export async function signOutUser() {
  if (!supabase) throw new Error('Supabase not configured')

  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  if (!supabase) return null

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}

// Meals functions
export async function getMealsByDate(userId: string, date: string) {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .order('time', { ascending: true })

  if (error) {
    console.error('Error fetching meals:', error)
    return []
  }
  return data || []
}

export async function addMeal(userId: string, meal: Meal) {
  if (!supabase) throw new Error('Supabase not configured')

  const { data, error } = await supabase
    .from('meals')
    .insert([{
      user_id: userId,
      name: meal.name,
      type: meal.type,
      time: meal.time,
      calories: meal.calories,
      completed: meal.completed,
      notes: meal.notes,
      ingredients: meal.ingredients,
      date: new Date().toISOString().split('T')[0]
    }])
    .select()

  if (error) throw error
  return data?.[0]
}

export async function updateMeal(mealId: string, updates: Partial<Meal>) {
  if (!supabase) throw new Error('Supabase not configured')

  const { data, error } = await supabase
    .from('meals')
    .update(updates)
    .eq('id', mealId)
    .select()

  if (error) throw error
  return data?.[0]
}

export async function deleteMeal(mealId: string) {
  if (!supabase) throw new Error('Supabase not configured')

  const { error } = await supabase
    .from('meals')
    .delete()
    .eq('id', mealId)

  if (error) throw error
}

// Habits functions
export async function getHabits(userId: string) {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching habits:', error)
    return []
  }
  return data || []
}

export async function addHabit(userId: string, habit: Habit) {
  if (!supabase) throw new Error('Supabase not configured')

  const { data, error } = await supabase
    .from('habits')
    .insert([{
      user_id: userId,
      name: habit.name,
      category: habit.category,
      emoji: habit.emoji,
      completed: habit.completed,
      streak: habit.streak
    }])
    .select()

  if (error) throw error
  return data?.[0]
}

export async function updateHabit(habitId: string, updates: Partial<Habit>) {
  if (!supabase) throw new Error('Supabase not configured')

  const { data, error } = await supabase
    .from('habits')
    .update(updates)
    .eq('id', habitId)
    .select()

  if (error) throw error
  return data?.[0]
}

export async function deleteHabit(habitId: string) {
  if (!supabase) throw new Error('Supabase not configured')

  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', habitId)

  if (error) throw error
}

// Profile functions
export async function getProfile(userId: string) {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching profile:', error)
  }
  return data
}

export async function updateProfile(userId: string, profile: any) {
  if (!supabase) throw new Error('Supabase not configured')

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      user_id: userId,
      ...profile
    })
    .select()

  if (error) throw error
  return data?.[0]
}

// Messages functions
export async function getMessages(userId: string, limit: number = 50) {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching messages:', error)
    return []
  }
  return (data || []).reverse()
}

export async function addMessage(userId: string, role: 'user' | 'assistant', content: string) {
  if (!supabase) throw new Error('Supabase not configured')

  const { data, error } = await supabase
    .from('messages')
    .insert([{
      user_id: userId,
      role,
      content
    }])
    .select()

  if (error) throw error
  return data?.[0]
}
