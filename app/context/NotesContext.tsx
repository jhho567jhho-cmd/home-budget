'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface Note {
  id: string
  clientId: string
  content: string
  createdAt: string
  updatedAt: string
}

interface NotesContextType {
  notes: Note[]
  addNote: (clientId: string, content: string) => void
  updateNote: (id: string, content: string) => void
  deleteNote: (id: string) => void
  getNote: (id: string) => Note | undefined
  getNotesByClient: (clientId: string) => Note[]
  isLoading: boolean
}

const NotesContext = createContext<NotesContextType | undefined>(undefined)

const STORAGE_KEY = 'nlp-coach-notes'

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // טען מ-localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setNotes(JSON.parse(stored))
      }
    } catch (error) {
      console.error('שגיאה בטעינת הערות:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // שמור ל-localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
    }
  }, [notes, isLoading])

  const addNote = (clientId: string, content: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      clientId,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setNotes((prev) => [newNote, ...prev])
  }

  const updateNote = (id: string, content: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? { ...note, content, updatedAt: new Date().toISOString() }
          : note
      )
    )
  }

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id))
  }

  const getNote = (id: string) => {
    return notes.find((note) => note.id === id)
  }

  const getNotesByClient = (clientId: string) => {
    return notes
      .filter((note) => note.clientId === clientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  return (
    <NotesContext.Provider
      value={{
        notes,
        addNote,
        updateNote,
        deleteNote,
        getNote,
        getNotesByClient,
        isLoading,
      }}
    >
      {children}
    </NotesContext.Provider>
  )
}

export function useNotes() {
  const context = useContext(NotesContext)
  if (!context) {
    throw new Error('useNotes must be used within NotesProvider')
  }
  return context
}
