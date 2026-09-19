'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Client, ClientStatus } from '@/app/types'

interface ClientsContextType {
  clients: Client[]
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateClient: (id: string, client: Partial<Client>) => void
  deleteClient: (id: string) => void
  getClient: (id: string) => Client | undefined
  getClientsByStatus: (status: ClientStatus) => Client[]
  searchClients: (query: string) => Client[]
  isLoading: boolean
}

const ClientsContext = createContext<ClientsContextType | undefined>(undefined)

const STORAGE_KEY = 'nlp-coach-clients'

export function ClientsProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // טען מ-localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setClients(JSON.parse(stored))
      }
    } catch (error) {
      console.error('שגיאה בטעינת לקוחות:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // שמור ל-localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clients))
    }
  }, [clients, isLoading])

  const addClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newClient: Client = {
      ...clientData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setClients((prev) => [...prev, newClient])
  }

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients((prev) =>
      prev.map((client) =>
        client.id === id
          ? { ...client, ...updates, updatedAt: new Date().toISOString() }
          : client
      )
    )
  }

  const deleteClient = (id: string) => {
    setClients((prev) => prev.filter((client) => client.id !== id))
  }

  const getClient = (id: string) => {
    return clients.find((client) => client.id === id)
  }

  const getClientsByStatus = (status: ClientStatus) => {
    return clients.filter((client) => client.status === status)
  }

  const searchClients = (query: string) => {
    const lowerQuery = query.toLowerCase()
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(lowerQuery) ||
        client.email?.toLowerCase().includes(lowerQuery) ||
        client.phone?.includes(query)
    )
  }

  return (
    <ClientsContext.Provider
      value={{
        clients,
        addClient,
        updateClient,
        deleteClient,
        getClient,
        getClientsByStatus,
        searchClients,
        isLoading,
      }}
    >
      {children}
    </ClientsContext.Provider>
  )
}

export function useClients() {
  const context = useContext(ClientsContext)
  if (!context) {
    throw new Error('useClients must be used within ClientsProvider')
  }
  return context
}
