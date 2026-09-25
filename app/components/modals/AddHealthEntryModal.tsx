'use client'

import { useState } from 'react'
import { useHealth } from '@/app/context/ExpensesContext'

interface AddHealthEntryModalProps {
  onClose: () => void
}

const HEALTH_TYPES = [
  { id: 'פעילות', label: '💪 פעילות גופנית', unit: 'דקות' },
  { id: 'תזונה', label: '🥗 תזונה', unit: 'קלוריות' },
  { id: 'משקל', label: '⚖️ משקל', unit: 'ק״ג' },
  { id: 'שינה', label: '😴 שינה', unit: 'שעות' },
  { id: 'מים', label: '💧 שתיית מים', unit: 'מ״ל' },
  { id: 'כללי', label: '📝 רישום כללי', unit: 'יחידות' },
]

export default function AddHealthEntryModal({ onClose }: AddHealthEntryModalProps) {
  const { addEntry } = useHealth()
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'פעילות',
    value: '',
    unit: 'דקות',
    note: '',
  })

  const [error, setError] = useState('')

  const selectedType = HEALTH_TYPES.find((t) => t.id === formData.type)

  const handleTypeChange = (typeId: string) => {
    const type = HEALTH_TYPES.find((t) => t.id === typeId)
    setFormData({
      ...formData,
      type: typeId,
      unit: type?.unit || 'יחידות',
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.value.trim()) {
      setError('אנא הזן ערך')
      return
    }

    if (!formData.note.trim()) {
      setError('אנא הזן הערה או תיאור')
      return
    }

    try {
      addEntry({
        date: formData.date,
        type: formData.type,
        value: parseFloat(formData.value),
        unit: formData.unit,
        note: formData.note,
      })
      onClose()
    } catch (err) {
      setError('שגיאה בהוספת רישום בריאות')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50">
      <div className="bg-white w-full rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 text-2xl">
            ✕
          </button>
          <h2 className="text-2xl font-bold text-slate-800">➕ רישום בריאות חדש</h2>
          <div></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">תאריך</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300"
            />
          </div>

          {/* Type Selection - Quick buttons */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">סוג רישום</label>
            <div className="grid grid-cols-2 gap-2">
              {HEALTH_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleTypeChange(type.id)}
                  className={`p-3 rounded-lg font-semibold transition text-right ${
                    formData.type === type.id
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Value */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              ערך ({formData.unit})
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              placeholder="הזן את הערך"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-right"
              dir="rtl"
            />
          </div>

          {/* Unit */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">יחידה</label>
            <input
              type="text"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-right"
              dir="rtl"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">הערה או תיאור</label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="תיאור קצר של הרישום"
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-right"
              dir="rtl"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-right">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-200 text-slate-800 py-3 rounded-lg hover:bg-slate-300 font-semibold"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
            >
              שמור רישום
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
