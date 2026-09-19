'use client'

import { useState } from 'react'
import { useClients } from '@/app/context/ClientsContext'
import { useMeetings } from '@/app/context/MeetingsContext'
import { Meeting } from '@/app/types'
import { formatDate } from '@/app/utils/dateUtils'

interface MeetingDetailsModalProps {
  meeting: Meeting
  onClose: () => void
}

export default function MeetingDetailsModal({ meeting, onClose }: MeetingDetailsModalProps) {
  const { getClient } = useClients()
  const { deleteMeeting } = useMeetings()
  const client = getClient(meeting.clientId)

  const handleDelete = () => {
    if (window.confirm('האם אתה בטוח שרוצה למחוק פגישה זו?')) {
      deleteMeeting(meeting.id)
      onClose()
    }
  }

  const getSummaryLabel = (key: string) => {
    const labels: Record<string, string> = {
      mainTopic: '🎯 נושא מרכזי',
      goals: '📌 מטרות',
      keyPoints: '💡 נקודות מרכזיות',
      whatWasDone: '✅ מה נעשה',
      nextSteps: '📝 משימות להמשך',
      nextCheckpoints: '🔍 מה לבדוק בפגישה הבאה',
      coachNotes: '📋 הערות המאמנת',
    }
    return labels[key] || key
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50">
      <div className="bg-white w-full rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 text-2xl">
            ✕
          </button>
          <h2 className="text-2xl font-bold text-slate-800">📋 פרטי פגישה</h2>
          <div></div>
        </div>

        {/* Meeting Info */}
        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200 mb-6">
          {client && (
            <div className="mb-3">
              <div className="text-sm text-slate-600">👤 לקוח</div>
              <div className="font-semibold text-slate-800">{client.name}</div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-slate-600">📅 תאריך</div>
              <div className="font-semibold text-slate-800">
                {formatDate(new Date(meeting.date))}
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-600">⏰ שעה</div>
              <div className="font-semibold text-slate-800">{meeting.time}</div>
            </div>
            <div>
              <div className="text-sm text-slate-600">⏱️ משך</div>
              <div className="font-semibold text-slate-800">{meeting.duration} דקות</div>
            </div>
            <div>
              <div className="text-sm text-slate-600">📍 סוג</div>
              <div className="font-semibold text-slate-800">
                {meeting.type === 'session'
                  ? 'הפגשה'
                  : meeting.type === 'assessment'
                  ? 'הערכה'
                  : meeting.type === 'followup'
                  ? 'מעקב'
                  : 'ייעוץ'}
              </div>
            </div>
            <div className="col-span-2">
              <div className="text-sm text-slate-600">📌 מיקום</div>
              <div className="font-semibold text-slate-800">
                {meeting.location === 'online'
                  ? 'אונליין'
                  : meeting.location === 'office'
                  ? 'משרד'
                  : 'טלפון'}
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        {meeting.summary && (
          <div className="space-y-4 mb-6">
            {meeting.summary.mainTopic && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">🎯 נושא מרכזי</h3>
                <p className="text-slate-700 text-sm">{meeting.summary.mainTopic}</p>
              </div>
            )}

            {meeting.summary.goals && meeting.summary.goals.length > 0 && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">📌 מטרות</h3>
                <ul className="text-slate-700 text-sm space-y-1">
                  {meeting.summary.goals.map((goal, idx) => (
                    <li key={idx}>• {goal}</li>
                  ))}
                </ul>
              </div>
            )}

            {meeting.summary.keyPoints && meeting.summary.keyPoints.length > 0 && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">💡 נקודות מרכזיות</h3>
                <ul className="text-slate-700 text-sm space-y-1">
                  {meeting.summary.keyPoints.map((point, idx) => (
                    <li key={idx}>• {point}</li>
                  ))}
                </ul>
              </div>
            )}

            {meeting.summary.whatWasDone && meeting.summary.whatWasDone.length > 0 && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">✅ מה נעשה</h3>
                <ul className="text-slate-700 text-sm space-y-1">
                  {meeting.summary.whatWasDone.map((item, idx) => (
                    <li key={idx}>✓ {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {meeting.summary.nextSteps && meeting.summary.nextSteps.length > 0 && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">📝 משימות להמשך</h3>
                <ul className="text-slate-700 text-sm space-y-1">
                  {meeting.summary.nextSteps.map((step, idx) => (
                    <li key={idx}>→ {step}</li>
                  ))}
                </ul>
              </div>
            )}

            {meeting.summary.nextCheckpoints && meeting.summary.nextCheckpoints.length > 0 && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">🔍 מה לבדוק בפגישה הבאה</h3>
                <ul className="text-slate-700 text-sm space-y-1">
                  {meeting.summary.nextCheckpoints.map((checkpoint, idx) => (
                    <li key={idx}>? {checkpoint}</li>
                  ))}
                </ul>
              </div>
            )}

            {meeting.summary.coachNotes && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">📋 הערות המאמנת</h3>
                <p className="text-slate-700 text-sm whitespace-pre-wrap">
                  {meeting.summary.coachNotes}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={() => {
              onClose()
            }}
            className="flex-1 bg-slate-200 text-slate-800 py-3 rounded-lg hover:bg-slate-300 transition font-semibold text-sm"
          >
            סגור
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-50 text-red-600 border border-red-200 py-3 rounded-lg hover:bg-red-100 transition font-semibold text-sm"
          >
            מחק פגישה
          </button>
        </div>
      </div>
    </div>
  )
}
