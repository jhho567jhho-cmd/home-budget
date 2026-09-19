'use client'

import { useState } from 'react'
import { useKnowledge } from '@/app/context/KnowledgeContext'
import { KnowledgeType, KnowledgeCategory } from '@/app/types'

const TYPES: { value: KnowledgeType; label: string }[] = [
  { value: 'article', label: 'מאמר' },
  { value: 'exercise', label: 'תרגיל' },
  { value: 'technique', label: 'טכניקה' },
  { value: 'template', label: 'תבנית' },
  { value: 'resource', label: 'משאב' },
  { value: 'video', label: 'וידאו' },
]

const CATEGORIES: { value: KnowledgeCategory; label: string }[] = [
  { value: 'nlp-basics', label: 'היסודות' },
  { value: 'coaching-techniques', label: 'טכניקות' },
  { value: 'client-outcomes', label: 'תוצאות' },
  { value: 'templates', label: 'תבניות' },
  { value: 'tools', label: 'כלים' },
  { value: 'research', label: 'מחקר' },
]

interface KnowledgeDetailModalProps {
  itemId: string
  onClose: () => void
}

export default function KnowledgeDetailModal({
  itemId,
  onClose,
}: KnowledgeDetailModalProps) {
  const { getItem, updateItem, deleteItem } = useKnowledge()
  const item = getItem(itemId)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(item?.title || '')
  const [editDescription, setEditDescription] = useState(item?.description || '')
  const [editContent, setEditContent] = useState(item?.content || '')
  const [editTagsInput, setEditTagsInput] = useState(item?.tags.join(', ') || '')

  if (!item) {
    return null
  }

  const handleSaveEdit = () => {
    if (!editTitle.trim() || !editDescription.trim() || !editContent.trim()) {
      alert('אנא מלא את כל השדות הנדרשים')
      return
    }

    const tags = editTagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag)

    updateItem(itemId, {
      title: editTitle,
      description: editDescription,
      content: editContent,
      tags,
    })

    setIsEditing(false)
  }

  const handleDelete = () => {
    if (confirm('האם אתה בטוח שברצונך למחוק פריט זה?')) {
      deleteItem(itemId)
      onClose()
    }
  }

  const categoryLabel = CATEGORIES.find((c) => c.value === item.category)?.label
  const typeLabel = TYPES.find((t) => t.value === item.type)?.label

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-slate-600 hover:text-slate-800 text-2xl"
          >
            ✕
          </button>
          <h2 className="text-xl font-bold text-slate-800 flex-1 text-center">
            פרטי פריט
          </h2>
          <button
            onClick={() => (isEditing ? setIsEditing(false) : setIsEditing(true))}
            className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
          >
            {isEditing ? 'בטל' : '✏️ ערוך'}
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {!isEditing ? (
            <>
              {/* Display Mode */}
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">
                  {item.title}
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                    {categoryLabel}
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                    {typeLabel}
                  </span>
                  <span className="text-xs">
                    {item.importance === 'high'
                      ? '🔴 חשוב'
                      : item.importance === 'medium'
                      ? '🟡 בינוני'
                      : '🟢 נמוך'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  תיאור
                </label>
                <p className="text-slate-600 whitespace-pre-wrap">
                  {item.description}
                </p>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  תוכן
                </label>
                <div className="bg-slate-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                  <p className="text-slate-700 whitespace-pre-wrap text-sm leading-relaxed">
                    {item.content}
                  </p>
                </div>
              </div>

              {/* Tags */}
              {item.tags.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    תגים
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="border-t border-slate-200 pt-4 space-y-2">
                {item.author && (
                  <div>
                    <span className="text-xs text-slate-500">מחבר:</span>
                    <p className="text-sm text-slate-700">✍️ {item.author}</p>
                  </div>
                )}
                {item.source && (
                  <div>
                    <span className="text-xs text-slate-500">מקור:</span>
                    <p className="text-sm text-slate-700">📎 {item.source}</p>
                  </div>
                )}
                <div>
                  <span className="text-xs text-slate-500">שפה:</span>
                  <p className="text-sm text-slate-700">
                    {item.language === 'he' ? '🇮🇱 עברית' : '🇬🇧 אנגלית'}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-500">תאריך יצירה:</span>
                  <p className="text-sm text-slate-700">
                    {new Date(item.createdAt).toLocaleDateString('he-IL')}
                  </p>
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={handleDelete}
                className="w-full bg-red-100 text-red-700 py-2 rounded-lg font-semibold hover:bg-red-200 transition mt-4"
              >
                🗑️ מחק פריט
              </button>
            </>
          ) : (
            <>
              {/* Edit Mode */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  כותרת
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-right"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  תיאור
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-right resize-none"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  תוכן
                </label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-right resize-none"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  תגים (מופרדים בפסיקים)
                </label>
                <input
                  type="text"
                  value={editTagsInput}
                  onChange={(e) => setEditTagsInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-right"
                  dir="rtl"
                />
              </div>

              <button
                onClick={handleSaveEdit}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition mt-4"
              >
                💾 שמור שינויים
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
