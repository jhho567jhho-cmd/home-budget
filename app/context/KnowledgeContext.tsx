'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { KnowledgeItem } from '@/app/types'

interface KnowledgeContextType {
  items: KnowledgeItem[]
  addItem: (item: Omit<KnowledgeItem, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateItem: (id: string, item: Partial<KnowledgeItem>) => void
  deleteItem: (id: string) => void
  getItem: (id: string) => KnowledgeItem | undefined
  getItemsByCategory: (category: string) => KnowledgeItem[]
  getItemsByType: (type: string) => KnowledgeItem[]
  searchItems: (query: string) => KnowledgeItem[]
  getItemsByTag: (tag: string) => KnowledgeItem[]
}

const KnowledgeContext = createContext<KnowledgeContextType | undefined>(undefined)

const STORAGE_KEY = 'nlp-coach-knowledge'

const DEFAULT_ITEMS: Omit<KnowledgeItem, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'מהו NLP? מבוא בסיסי',
    type: 'article',
    category: 'nlp-basics',
    description: 'הסברה מקיף לעולם NLP - מה זה, למה זה חשוב ואיך זה עובד',
    content: 'NLP (Neuro-Linguistic Programming) הוא שדה תיאורטי וכלי פרקטי שעוזר בשינוי תהליכים פסיכולוגיים. NLP חוקר את הקשר בין תהליכי נוירולוגיים, שפה ותבניות התנהגותיות שנלמדו ויכולים ללמוד מחדש. היא משמשת לשיפור תקשורת, פתרון בעיות וקידום צמיחה אישית.',
    tags: ['nlp', 'היסודות', 'מבוא'],
    author: 'NLP Trainer',
    importance: 'high',
    language: 'he',
  },
  {
    title: 'טכניקת Anchoring בתרגול',
    type: 'technique',
    category: 'coaching-techniques',
    description: 'שיטה פרקטית ליצירת קישורים בין מצב נפשי חיובי ותנבית',
    content: 'Anchoring היא טכניקה המאפשרת לקשור מצב פנימי חיובי לתנבית חיצונית (תנועה, צליל, תמונה). כאשר הלקוח חוזר על התנבית, הם מפעילים מחדש את המצב החיובי.',
    tags: ['anchoring', 'טכניקה', 'state-management'],
    author: 'NLP Practitioner',
    importance: 'high',
    language: 'he',
  },
  {
    title: 'דוגמה: תבנית מטפול לחרדה',
    type: 'template',
    category: 'templates',
    description: 'תבנית מובנית לעבודה עם לקוחות הסובלים מחרדה',
    content: 'שלב 1: זיהוי התנבית של החרדה\nשלב 2: פירוק הכלים הפנימיים\nשלב 3: יצירת משאבים חדשים\nשלב 4: עיגון התוצאה החדשה',
    tags: ['template', 'חרדה', 'טיפול'],
    importance: 'medium',
    language: 'he',
  },
  {
    title: 'כלים למדידת התקדמות',
    type: 'resource',
    category: 'tools',
    description: 'טבלאות וכלים לעקוב אחר התקדמות הלקוח',
    content: 'קנה מידה 1-10 להערכת שיפור\nדף מעקב השבועי\nשאלות מה שימוש לחזרה\nטבלת משימות בין הפגישות',
    tags: ['מדידה', 'progress-tracking', 'כלים'],
    importance: 'medium',
    language: 'he',
  },
  {
    title: 'מחקר: תוצאות NLP בשנים 2023-2024',
    type: 'article',
    category: 'research',
    description: 'סיכום מחקרים אחרונים על יעילות NLP בטיפול',
    content: 'מחקרים אחרונים מראים שימוש של NLP בשילוב עם קוג\'ניטיבי-התנהגותי טיפול מגביר משמעותית את שיעורי ההצלחה. בעיקר בתחומי: קשקושים, ניהול חרדה, וגיבוש עצמי.',
    tags: ['מחקר', 'data', 'outcomes'],
    author: 'Research Institute',
    importance: 'medium',
    language: 'he',
  },
]

export function KnowledgeProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<KnowledgeItem[]>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setItems(JSON.parse(stored))
      } else {
        // אם אין נתונים שמורים, טען ברירות מחדל
        const defaultItems: KnowledgeItem[] = DEFAULT_ITEMS.map((item) => ({
          ...item,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }))
        setItems(defaultItems)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultItems))
      }
    } catch (error) {
      console.error('שגיאה בטעינת ספריית הידע:', error)
    }
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    }
  }, [items, isMounted])

  const addItem = (item: Omit<KnowledgeItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: KnowledgeItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setItems((prev) => [...prev, newItem])
  }

  const updateItem = (id: string, updates: Partial<KnowledgeItem>) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, ...updates, updatedAt: new Date().toISOString() }
          : item
      )
    )
  }

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const getItem = (id: string) => {
    return items.find((item) => item.id === id)
  }

  const getItemsByCategory = (category: string) => {
    return items.filter((item) => item.category === category)
  }

  const getItemsByType = (type: string) => {
    return items.filter((item) => item.type === type)
  }

  const searchItems = (query: string) => {
    const lowerQuery = query.toLowerCase()
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery) ||
        item.content.toLowerCase().includes(lowerQuery) ||
        item.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    )
  }

  const getItemsByTag = (tag: string) => {
    return items.filter((item) => item.tags.includes(tag))
  }

  return (
    <KnowledgeContext.Provider
      value={{
        items,
        addItem,
        updateItem,
        deleteItem,
        getItem,
        getItemsByCategory,
        getItemsByType,
        searchItems,
        getItemsByTag,
      }}
    >
      {children}
    </KnowledgeContext.Provider>
  )
}

export function useKnowledge() {
  const context = useContext(KnowledgeContext)
  if (!context) {
    throw new Error('useKnowledge must be used within KnowledgeProvider')
  }
  return context
}
