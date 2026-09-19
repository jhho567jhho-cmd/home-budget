'use client'

import { useState } from 'react'
import { useClients } from '@/app/context/ClientsContext'
import { ClientStatus } from '@/app/types'

interface AddClientModalProps {
  onClose: () => void
}

export default function AddClientModal({ onClose }: AddClientModalProps) {
  const { addClient } = useClients()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    startDate: new Date().toISOString().split('T')[0],
    status: 'new' as ClientStatus,
    goals: '',
    notes: '',
  })

  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim()) {
      setError('אנא הזן שם לקוח')
      return
    }

    try {
      addClient({
        name: formData.name,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        startDate: formData.startDate,
        status: formData.status,
        goals: formData.goals ? formData.goals.split('\n').filter((g) => g.trim()) : [],
        notes: formData.notes,
      })
      onClose()
    } catch (err) {
      setError('שגיאה בהוספת לקוח')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50">
      <div className="bg-white w-full rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 text-2xl"
          >
            ✕
          </button>
          <h2 className="text-2xl font-bold text-slate-800">לקוח חדש</h2>
          <div></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              שם הלקוח *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="הזן שם"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-right"
              dir="rtl"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              אימייל
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@example.com"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-right"
              dir="rtl"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              טלפון
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="050-1234567"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-right"
              dir="rtl"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              תאריך התחלה
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              סטטוס
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as ClientStatus })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            >
              <option value="new">חדש</option>
              <option value="active">פעיל</option>
              <option value="followup">דורש מעקב</option>
              <option value="inactive">לא פעיל</option>
            </select>
          </div>

          {/* Goals */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              מטרות (כל מטרה בשורה חדשה)
            </label>
            <textarea
              value={formData.goals}
              onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
              placeholder="מטרה 1&#10;מטרה 2"
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-right"
              dir="rtl"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              הערות
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="הוסף הערות כלליות..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-right"
              dir="rtl"
            />
          </div>

          {/* Error */}
          {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-right">{error}</div>}

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
              הוסף לקוח
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
