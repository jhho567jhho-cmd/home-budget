// Local Storage utilities for persisting data

interface StoredExpense {
  id: number
  amount: number
  category: string
  description: string
  timestamp: number
}

const STORAGE_KEY = 'budget_buddy_expenses'
const MESSAGES_KEY = 'budget_buddy_messages'

export function saveExpenses(expenses: StoredExpense[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
  } catch (error) {
    console.error('Failed to save expenses:', error)
  }
}

export function loadExpenses(): StoredExpense[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Failed to load expenses:', error)
    return []
  }
}

export function saveMessages(messages: any[]): void {
  try {
    const messagesToSave = messages.map((m) => ({
      role: m.role,
      content: m.content,
      timestamp: m.timestamp.getTime(),
    }))
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messagesToSave))
  } catch (error) {
    console.error('Failed to save messages:', error)
  }
}

export function loadMessages(): any[] {
  try {
    const data = localStorage.getItem(MESSAGES_KEY)
    if (!data) return []

    return JSON.parse(data).map((m: any) => ({
      role: m.role,
      content: m.content,
      timestamp: new Date(m.timestamp),
    }))
  } catch (error) {
    console.error('Failed to load messages:', error)
    return []
  }
}

export function clearAllData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(MESSAGES_KEY)
  } catch (error) {
    console.error('Failed to clear data:', error)
  }
}
