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

interface AddKnowledgeModalProps {
  onClose: () => void
}

export default function AddKnowledgeModal({ onClose }: AddKnowledgeModalProps) {
  const { addItem } = useKnowledge()
  const [title, setTitle] = useState('')
  const [type, setType] = useState<KnowledgeType>('article')
  const [category, setCategory] = useState<KnowledgeCategory>('nlp-basics')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [author, setAuthor] = useState('')
  const [source, setSource] = useState('')
  const [importance, setImportance] = useState<'low' | 'medium' | 'high'>('medium')
  const [language, setLanguage] = useState<'he' | 'en'>('he')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !description.trim() || !content.trim()) {
      alert('אנא מלא את כל השדות הנדרשים')
      return
    }

    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag)

    addItem({
      title,
      type,
      category,
      description,
      content,
      tags,
      author: author || undefined,
      source: source || undefined,
      importance,
      language,
    })

    onClose()
  }

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
          <h2 className="text-xl font-bold text-slate-800">הוסף לספריה</h2>
          <div></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              כותרת *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="כותרת הפריט"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-right"
              dir="rtl"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              תיאור *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="תיאור קצר של התוכן"
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-right resize-none"
              dir="rtl"
            />
          </div>

          {/* Type and Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                סוג
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as KnowledgeType)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-right"
                dir="rtl"
              >
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                קטגוריה
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as KnowledgeCategory)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-right"
                dir="rtl"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              תוכן *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="התוכן המלא (טקסט או URL)"
              rows={5}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-right resize-none"
              dir="rtl"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              תגים (מופרדים בפסיקים)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="nlp, technique, coaching"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-right"
              dir="rtl"
            />
          </div>

          {/* Author and Source */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                מחבר
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="שם המחבר"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-right"
                dir="rtl"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                מקור
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="מקור הנתונים"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-right"
                dir="rtl"
              />
            </div>
          </div>

          {/* Importance and Language */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                חשיבות
              </label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as const).map((imp) => (
                  <button
                    key={imp}
                    type="button"
                    onClick={() => setImportance(imp)}
                    className={`flex-1 py-2 rounded transition ${
                      importance === imp
                        ? imp === 'high'
                          ? 'bg-red-100 text-red-700 border-2 border-red-600'
                          : imp === 'medium'
                          ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-600'
                          : 'bg-green-100 text-green-700 border-2 border-green-600'
                        : 'bg-slate-100 text-slate-600 border-2 border-transparent'
                    }`}
                  >
                    {imp === 'high' ? '🔴' : imp === 'medium' ? '🟡' : '🟢'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                שפה
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'he' | 'en')}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-right"
                dir="rtl"
              >
                <option value="he">עברית</option>
                <option value="en">אנגלית</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition mt-6"
          >
            שמור בספריה
          </button>
        </form>
      </div>
    </div>
  )
}
