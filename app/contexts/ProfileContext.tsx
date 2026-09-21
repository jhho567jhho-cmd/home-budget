'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { UserProfile } from '../types'

interface ProfileContextType {
  profile: UserProfile | null
  updateProfile: (profile: Partial<UserProfile>) => void
  setName: (name: string) => void
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null)

  // טעון מ-localStorage
  useEffect(() => {
    const saved = localStorage.getItem('user-profile')
    if (saved) {
      setProfile(JSON.parse(saved))
    } else {
      const defaultProfile: UserProfile = {
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
      setProfile(defaultProfile)
      localStorage.setItem('user-profile', JSON.stringify(defaultProfile))
    }
  }, [])

  // שמור בכל שינוי
  useEffect(() => {
    if (profile) {
      localStorage.setItem('user-profile', JSON.stringify(profile))
    }
  }, [profile])

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!profile) return
    setProfile({
      ...profile,
      ...updates,
      preferences: {
        ...profile.preferences,
        ...(updates.preferences || {})
      }
    })
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
