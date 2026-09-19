'use client'

import { useState } from 'react'
import { useNotes } from '@/app/context/NotesContext'

interface AddNoteModalProps {
  clientId: string
  onClose: () => void
}

export default function AddNoteModal({ clientId, onClose }: AddNoteModalProps) {
  const { addNote } = useNotes()
  const [content, setContent] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!content.trim()) {
      setError('אנא כתוב הערה')
      return
    }

    try {
      addNote(clientId, content)
      onClose()
    } catch (err) {
      setError('שגיאה בהוספת הערה')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50">
      <div className="bg-white w-full rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 text-2xl">
            ✕
          </button>
          <h2 className="text-2xl font-bold text-slate-800">📝 הערה חדשה</h2>
          <div></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              כתוב הערה *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="כתוב הערה או הסבר..."
              rows={6}
              autoFocus
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-right resize-none"
              dir="rtl"
            />
            <div className="text-xs text-slate-500 mt-2">
              {content.length} תווים
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-right text-sm">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-200 text-slate-800 py-3 rounded-lg hover:bg-slate-300 transition font-semibold"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
              שמור הערה
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
