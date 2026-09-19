'use client'

import { useState, useMemo } from 'react'
import { useKnowledge } from '@/app/context/KnowledgeContext'
import { KnowledgeType, KnowledgeCategory } from '@/app/types'
import AddKnowledgeModal from '@/app/components/modals/AddKnowledgeModal'
import KnowledgeDetailModal from '@/app/components/modals/KnowledgeDetailModal'

const CATEGORIES: { value: KnowledgeCategory; label: string; icon: string }[] = [
  { value: 'nlp-basics', label: 'היסודות', icon: '📚' },
  { value: 'coaching-techniques', label: 'טכניקות', icon: '🎯' },
  { value: 'client-outcomes', label: 'תוצאות', icon: '✨' },
  { value: 'templates', label: 'תבניות', icon: '📋' },
  { value: 'tools', label: 'כלים', icon: '🛠️' },
  { value: 'research', label: 'מחקר', icon: '🔬' },
]

const TYPES: { value: KnowledgeType; label: string }[] = [
  { value: 'article', label: 'מאמר' },
  { value: 'exercise', label: 'תרגיל' },
  { value: 'technique', label: 'טכניקה' },
  { value: 'template', label: 'תבנית' },
  { value: 'resource', label: 'משאב' },
  { value: 'video', label: 'וידאו' },
]

interface KnowledgeBaseScreenProps {
  userEmail: string
}

export default function KnowledgeBaseScreen({ userEmail }: KnowledgeBaseScreenProps) {
  const { items, deleteItem, searchItems } = useKnowledge()
  const [selectedCategory, setSelectedCategory] = useState<KnowledgeCategory | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // סינון פריטים לפי קטגוריה וחיפוש
  const filteredItems = useMemo(() => {
    let result = items

    if (selectedCategory) {
      result = result.filter((item) => item.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      result = searchItems(searchQuery)
      if (selectedCategory) {
        result = result.filter((item) => item.category === selectedCategory)
      }
    }

    return result
  }, [items, selectedCategory, searchQuery, searchItems])

  const handleDeleteItem = (id: string) => {
    if (confirm('האם אתה בטוח שברצונך למחוק פריט זה?')) {
      deleteItem(id)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-4 z-10">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
          >
            + הוסף
          </button>
          <h1 className="text-2xl font-bold text-slate-800">📚 ספריית הידע</h1>
          <div></div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-16 z-9">
        <input
          type="text"
          placeholder="חפש בספריה..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-right"
          dir="rtl"
        />
      </div>

      {/* Category Tabs */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 overflow-x-auto sticky top-32 z-8">
        <div className="flex gap-2 whitespace-nowrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 rounded text-sm font-medium transition ${
              selectedCategory === null
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            הכל
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1 rounded text-sm font-medium transition flex items-center gap-1 ${
                selectedCategory === cat.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-2xl mx-auto w-full">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-slate-600 text-center">
              {searchQuery
                ? 'לא נמצאו תוצאות חיפוש'
                : selectedCategory
                ? 'אין פריטים בקטגוריה זו'
                : 'ספריית הידע ריקה'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedItem(item.id)
                  setShowDetailModal(true)
                }}
                className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="text-sm font-semibold text-indigo-600">
                    {CATEGORIES.find((c) => c.value === item.category)?.icon}{' '}
                    {CATEGORIES.find((c) => c.value === item.category)?.label}
                  </div>
                  <div className="text-xs text-slate-500">
                    {item.importance === 'high'
                      ? '🔴'
                      : item.importance === 'medium'
                      ? '🟡'
                      : '🟢'}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-slate-800 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-1 flex-wrap">
                    {item.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 2 && (
                      <span className="text-xs text-slate-500">
                        +{item.tags.length - 2} עוד
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400">
                    {TYPES.find((t) => t.value === item.type)?.label}
                  </div>
                </div>

                {item.author && (
                  <div className="text-xs text-slate-500">✍️ {item.author}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddKnowledgeModal onClose={() => setShowAddModal(false)} />
      )}

      {showDetailModal && selectedItem && (
        <KnowledgeDetailModal
          itemId={selectedItem}
          onClose={() => {
            setShowDetailModal(false)
            setSelectedItem(null)
          }}
        />
      )}
    </div>
  )
}
