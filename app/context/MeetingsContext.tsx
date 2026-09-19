'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Meeting, MeetingType } from '@/app/types'

interface MeetingsContextType {
  meetings: Meeting[]
  addMeeting: (meeting: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateMeeting: (id: string, meeting: Partial<Meeting>) => void
  deleteMeeting: (id: string) => void
  getMeeting: (id: string) => Meeting | undefined
  getMeetingsByClient: (clientId: string) => Meeting[]
  getUpcomingMeetings: (clientId?: string) => Meeting[]
  getLastMeeting: (clientId: string) => Meeting | undefined
  getNextMeeting: (clientId: string) => Meeting | undefined
  isLoading: boolean
}

const MeetingsContext = createContext<MeetingsContextType | undefined>(undefined)

const STORAGE_KEY = 'nlp-coach-meetings'

export function MeetingsProvider({ children }: { children: React.ReactNode }) {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // טען מ-localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setMeetings(JSON.parse(stored))
      }
    } catch (error) {
      console.error('שגיאה בטעינת פגישות:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // שמור ל-localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings))
    }
  }, [meetings, isLoading])

  const addMeeting = (meetingData: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newMeeting: Meeting = {
      ...meetingData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setMeetings((prev) => [...prev, newMeeting])
  }

  const updateMeeting = (id: string, updates: Partial<Meeting>) => {
    setMeetings((prev) =>
      prev.map((meeting) =>
        meeting.id === id
          ? { ...meeting, ...updates, updatedAt: new Date().toISOString() }
          : meeting
      )
    )
  }

  const deleteMeeting = (id: string) => {
    setMeetings((prev) => prev.filter((meeting) => meeting.id !== id))
  }

  const getMeeting = (id: string) => {
    return meetings.find((meeting) => meeting.id === id)
  }

  const getMeetingsByClient = (clientId: string) => {
    return meetings.filter((meeting) => meeting.clientId === clientId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const getUpcomingMeetings = (clientId?: string) => {
    const now = new Date()
    return meetings
      .filter((meeting) => {
        const meetingDate = new Date(meeting.date)
        if (clientId) return meetingDate > now && meeting.clientId === clientId
        return meetingDate > now
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  const getLastMeeting = (clientId: string) => {
    const clientMeetings = getMeetingsByClient(clientId)
    return clientMeetings.length > 0 ? clientMeetings[0] : undefined
  }

  const getNextMeeting = (clientId: string) => {
    return getUpcomingMeetings(clientId)[0]
  }

  return (
    <MeetingsContext.Provider
      value={{
        meetings,
        addMeeting,
        updateMeeting,
        deleteMeeting,
        getMeeting,
        getMeetingsByClient,
        getUpcomingMeetings,
        getLastMeeting,
        getNextMeeting,
        isLoading,
      }}
    >
      {children}
    </MeetingsContext.Provider>
  )
}

export function useMeetings() {
  const context = useContext(MeetingsContext)
  if (!context) {
    throw new Error('useMeetings must be used within MeetingsProvider')
  }
  return context
}
