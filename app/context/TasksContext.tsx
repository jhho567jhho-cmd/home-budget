'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Task, TaskStatus } from '@/app/types'

interface TasksContextType {
  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTask: (id: string, task: Partial<Task>) => void
  deleteTask: (id: string) => void
  getTask: (id: string) => Task | undefined
  getTasksByClient: (clientId: string) => Task[]
  getTasksByStatus: (status: TaskStatus, clientId?: string) => Task[]
  getTodaysTasks: (clientId?: string) => Task[]
  getOverdueTasks: (clientId?: string) => Task[]
  isLoading: boolean
}

const TasksContext = createContext<TasksContextType | undefined>(undefined)

const STORAGE_KEY = 'nlp-coach-tasks'

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // טען מ-localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setTasks(JSON.parse(stored))
      }
    } catch (error) {
      console.error('שגיאה בטעינת משימות:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // שמור ל-localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    }
  }, [tasks, isLoading])

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setTasks((prev) => [...prev, newTask])
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      )
    )
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const getTask = (id: string) => {
    return tasks.find((task) => task.id === id)
  }

  const getTasksByClient = (clientId: string) => {
    return tasks.filter((task) => task.clientId === clientId).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  }

  const getTasksByStatus = (status: TaskStatus, clientId?: string) => {
    return tasks.filter((task) => {
      if (clientId) return task.status === status && task.clientId === clientId
      return task.status === status
    })
  }

  const getTodaysTasks = (clientId?: string) => {
    const today = new Date().toISOString().split('T')[0]
    return tasks.filter((task) => {
      if (clientId) return task.dueDate === today && task.clientId === clientId
      return task.dueDate === today
    })
  }

  const getOverdueTasks = (clientId?: string) => {
    const today = new Date().toISOString().split('T')[0]
    return tasks.filter((task) => {
      const isOverdue = task.dueDate < today && task.status !== 'completed'
      if (clientId) return isOverdue && task.clientId === clientId
      return isOverdue
    })
  }

  return (
    <TasksContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        getTask,
        getTasksByClient,
        getTasksByStatus,
        getTodaysTasks,
        getOverdueTasks,
        isLoading,
      }}
    >
      {children}
    </TasksContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TasksContext)
  if (!context) {
    throw new Error('useTasks must be used within TasksProvider')
  }
  return context
}
