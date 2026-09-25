'use client'

import { useState } from 'react'
import { useMeetings } from '@/app/context/MeetingsContext'
import { MeetingType } from '@/app/types'

interface AddMeetingModalProps {
  clientId?: string
  onClose: () => void
}

export default function AddMeetingModal({ clientId = '', onClose }: AddMeetingModalProps) {
  const { addMeeting } = useMeetings()
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    duration: 60,
    type: 'session' as MeetingType,
    location: 'online',
    mainTopic: '',
    goals: '',
    keyPoints: '',
    whatWasDone: '',
    nextSteps: '',
    nextCheckpoints: '',
    coachNotes: '',
  })

  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.mainTopic.trim()) {
      setError('אנא הזן נושא פגישה')
      return
    }

    try {
      addMeeting({
        clientId,
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
        type: formData.type,
        location: formData.location,
        summary: {
          mainTopic: formData.mainTopic,
          goals: formData.goals ? formData.goals.split('\n').filter((g) => g.trim()) : [],
          keyPoints: formData.keyPoints ? formData.keyPoints.split('\n').filter((p) => p.trim()) : [],
          whatWasDone: formData.whatWasDone ? formData.whatWasDone.split('\n').filter((w) => w.trim()) : [],
          nextSteps: formData.nextSteps ? formData.nextSteps.split('\n').filter((s) => s.trim()) : [],
          nextCheckpoints: formData.nextCheckpoints ? formData.nextCheckpoints.split('\n').filter((c) => c.trim()) : [],
          coachNotes: formData.coachNotes,
        },
      })
      onClose()
    } catch (err) {
      setError('שגיאה בהוספת פגישה')
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
          <h2 className="text-2xl font-bold text-slate-800">📋 פגישה חדשה</h2>
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

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">שעה</label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">משך (דקות)</label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300"
              min="15"
              step="15"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">סוג פגישה</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as MeetingType })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300"
            >
              <option value="session">הפגשה</option>
              <option value="assessment">הערכה</option>
              <option value="followup">מעקב</option>
              <option value="consultation">ייעוץ</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">מיקום</label>
            <select
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-slate-300"
            >
              <option value="online">אונליין</option>
              <option value="office">משרד</option>
              <option value="phone">טלפון</option>
            </select>
          </div>

          {/* Main Topic */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">נושא מרכזי *</label>
            <input
              type="text"
              value={formData.mainTopic}
              onChange={(e) => setFormData({ ...formData, mainTopic: e.target.value })}
              placeholder="מה הייתה הפגישה"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-right"
              dir="rtl"
            />
          </div>

          {/* Goals */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">מטרות (כל מטרה בשורה)</label>
            <textarea
              value={formData.goals}
              onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-right"
              dir="rtl"
            />
          </div>

          {/* Key Points */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">נקודות מרכזיות</label>
            <textarea
              value={formData.keyPoints}
              onChange={(e) => setFormData({ ...formData, keyPoints: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-right"
              dir="rtl"
            />
          </div>

          {/* What Was Done */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">מה נעשה</label>
            <textarea
              value={formData.whatWasDone}
              onChange={(e) => setFormData({ ...formData, whatWasDone: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-right"
              dir="rtl"
            />
          </div>

          {/* Next Steps */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">משימות להמשך</label>
            <textarea
              value={formData.nextSteps}
              onChange={(e) => setFormData({ ...formData, nextSteps: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-right"
              dir="rtl"
            />
          </div>

          {/* Next Checkpoints */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">מה לבדוק בפגישה הבאה</label>
            <textarea
              value={formData.nextCheckpoints}
              onChange={(e) => setFormData({ ...formData, nextCheckpoints: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 text-right"
              dir="rtl"
            />
          </div>

          {/* Coach Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">הערות המאמנת</label>
            <textarea
              value={formData.coachNotes}
              onChange={(e) => setFormData({ ...formData, coachNotes: e.target.value })}
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
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-semibold"
            >
              שמור פגישה
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
