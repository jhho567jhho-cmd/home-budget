'use client'

import { useState } from 'react'
import { useTasks } from '@/app/context/TasksContext'
import { TaskPriority } from '@/app/types'

interface AddTaskModalProps {
  clientId: string
  onClose: () => void
}

export default function AddTaskModal({ clientId, onClose }: AddTaskModalProps) {
  const { addTask } = useTasks()
  const [formData, setFormData] = useState({
    title: '',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '',
    priority: 'medium' as TaskPriority,
    notes: '',
  })

  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.title.trim()) {
      setError('אנא הזן כותרת משימה')
      return
    }

    try {
      addTask({
        title: formData.title,
        clientId,
        dueDate: formData.dueDate,
        dueTime: formData.dueTime || undefined,
        priority: formData.priority,
        status: 'new',
        notes: formData.notes,
      })
      onClose()
    } catch (err) {
      setError('שגיאה בהוספת משימה')
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
          <h2 className="text-2xl font-bold text-slate-800">✓ משימה חדשה</h2>
          <div></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">כותרת המשימה *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="הזן משימה"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-right"
              dir="rtl"
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">תאריך סיום</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Due Time */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">שעה (אופציונלי)</label>
            <input
              type="time"
              value={formData.dueTime}
              onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">עדיפות</label>
            <div className="flex gap-2">
              {[
                { value: 'low', label: '🟢 נמוכה', color: 'green' },
                { value: 'medium', label: '🟡 בינונית', color: 'amber' },
                { value: 'high', label: '🔴 גבוהה', color: 'red' },
              ].map((priority) => (
                <button
                  key={priority.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: priority.value as TaskPriority })}
                  className={`flex-1 px-3 py-2 rounded-lg border transition ${
                    formData.priority === priority.value
                      ? `bg-${priority.color}-100 border-${priority.color}-400 text-${priority.color}-800`
                      : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {priority.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">הערות</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="הוסף הערות..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-right"
              dir="rtl"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-right">{error}</div>
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
              הוסף משימה
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
