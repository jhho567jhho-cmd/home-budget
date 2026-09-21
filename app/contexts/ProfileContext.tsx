'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { UserProfile } from '../types'
import { useAuth } from './AuthContext'
import { getProfile as getSupabaseProfile, updateProfile as updateSupabaseProfile } from '../lib/supabase'

interface ProfileContextType {
  profile: UserProfile | null
  updateProfile: (profile: Partial<UserProfile>) => void
  setName: (name: string) => void
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

const DEFAULT_PROFILE: UserProfile = {
  name: 'משתמש',
  email: '',
  preferences: {
    mealTimes: {
      breakfast: '08:00',
      snack: '10:30',
      lunch: '13:00',
      dinner: '19:00'
    },
    sleepGoal: 8,
    waterGoal: 8,
    customHabits: []
  }
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user, useSupabase } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        if (useSupabase) {
          const supabaseProfile = await getSupabaseProfile(user.id)
          if (supabaseProfile) {
            setProfile({
              name: user.name,
              email: user.email || '',
              preferences: supabaseProfile.meal_times ? {
                mealTimes: supabaseProfile.meal_times,
                sleepGoal: 8,
                waterGoal: 8,
                customHabits: []
              } : DEFAULT_PROFILE.preferences
            })
          } else {
            setProfile({
              ...DEFAULT_PROFILE,
              name: user.name,
              email: user.email || ''
            })
          }
        } else {
          const storageKey = `profile-${user.id}`
          const saved = localStorage.getItem(storageKey)
          if (saved) {
            setProfile(JSON.parse(saved))
          } else {
            const newProfile = {
              ...DEFAULT_PROFILE,
              name: user.name,
              email: user.email || ''
            }
            setProfile(newProfile)
            localStorage.setItem(storageKey, JSON.stringify(newProfile))
          }
        }
      } catch (e) {
        console.error('Error loading profile:', e)
        setProfile({
          ...DEFAULT_PROFILE,
          name: user.name,
          email: user.email || ''
        })
      }

      setIsLoading(false)
    }

    loadProfile()
  }, [user, useSupabase])

  useEffect(() => {
    if (profile && user && !useSupabase) {
      const storageKey = `profile-${user.id}`
      localStorage.setItem(storageKey, JSON.stringify(profile))
    }
  }, [profile, user, useSupabase])

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile || !user) return

    const newProfile = {
      ...profile,
      ...updates,
      preferences: {
        ...profile.preferences,
        ...(updates.preferences || {})
      }
    }

    try {
      if (useSupabase) {
        await updateSupabaseProfile(user.id, {
          meal_times: newProfile.preferences.mealTimes,
          daily_goals: {
            sleepGoal: newProfile.preferences.sleepGoal,
            waterGoal: newProfile.preferences.waterGoal
          }
        })
      }
      setProfile(newProfile)
    } catch (e) {
      console.error('Error updating profile:', e)
    }
  }

  const setName = (name: string) => {
    if (!profile) return
    setProfile({
      ...profile,
      name
    })
  }

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, setName }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile חייב להיות בתוך ProfileProvider')
  }
  return context
}
