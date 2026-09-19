'use client'

import { useState } from 'react'
import { useClients } from '@/app/context/ClientsContext'
import { useMeetings } from '@/app/context/MeetingsContext'
import { useTasks } from '@/app/context/TasksContext'
import { formatDate } from '@/app/utils/dateUtils'
import AddMeetingModal from '../modals/AddMeetingModal'
import AddTaskModal from '../modals/AddTaskModal'

interface ClientDetailScreenProps {
  clientId: string
  onBack: () => void
}

export default function ClientDetailScreen({ clientId, onBack }: ClientDetailScreenProps) {
  const { getClient, updateClient, deleteClient } = useClients()
  const { getMeetingsByClient } = useMeetings()
  const { getTasksByClient } = useTasks()

  const client = getClient(clientId)
  const clientMeetings = getMeetingsByClient(clientId)
  const clientTasks = getTasksByClient(clientId)

  const [showAddMeeting, setShowAddMeeting] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)
  const [showEditMode, setShowEditMode] = useState(false)
  const [editForm, setEditForm] = useState(client ? { ...client } : null)

  if (!client || !editForm) {
    return (
      <div className="px-4 pt-6 pb-6 text-center">
        <p className="text-slate-600">לקוח לא נמצא</p>
        <button onClick={onBack} className="mt-4 text-indigo-600 underline">
          חזור
        </button>
      </div>
    )
  }

  const handleSaveEdits = () => {
    updateClient(clientId, editForm)
    setShowEditMode(false)
  }

  const handleDeleteClient = () => {
    if (window.confirm('האם אתה בטוח שרוצה למחוק לקוח זה?')) {
      deleteClient(clientId)
      onBack()
    }
  }

  return (
    <div className="pb-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-4 flex items-center justify-between">
        <button onClick={onBack} className="text-2xl">
          ←
        </button>
        <h1 className="text-xl font-bold text-slate-800">{client.name}</h1>
        <button
          onClick={() => setShowEditMode(!showEditMode)}
          className="text-indigo-600 hover:text-indigo-700"
        >
          {showEditMode ? '✓' : '✎'}
        </button>
      </div>

      <div className="px-4 pt-6">
        {/* Client Details */}
        {showEditMode ? (
          <div className="bg-white rounded-lg p-6 border border-slate-200 mb-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">שם</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-3 py-2 rounded border border-slate-300 focus:border-indigo-500 mt-1 text-right"
                dir="rtl"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">טלפון</label>
              <input
                type="tel"
                value={editForm.phone || ''}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="w-full px-3 py-2 rounded border border-slate-300 focus:border-indigo-500 mt-1 text-right"
                dir="rtl"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">אימייל</label>
              <input
                type="email"
                value={editForm.email || ''}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-3 py-2 rounded border border-slate-300 focus:border-indigo-500 mt-1 text-right"
                dir="rtl"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">סטטוס</label>
              <select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                className="w-full px-3 py-2 rounded border border-slate-300 focus:border-indigo-500 mt-1"
              >
                <option value="active">פעיל</option>
                <option value="new">חדש</option>
                <option value="followup">דורש מעקב</option>
                <option value="inactive">לא פעיל</option>
              </select>
            </div>
            <div className="pt-4 flex gap-2">
              <button
                onClick={handleSaveEdits}
                className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
              >
                שמור שינויים
              </button>
              <button
                onClick={() => {
                  setShowEditMode(false)
                  setEditForm(client)
                }}
                className="flex-1 bg-slate-200 text-slate-800 py-2 rounded hover:bg-slate-300"
              >
                ביטול
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-6 border border-slate-200 mb-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                client.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : client.status === 'new'
                  ? 'bg-blue-100 text-blue-700'
                  : client.status === 'followup'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-slate-100 text-slate-700'
              }`}>
                {client.status === 'active'
                  ? 'פעיל'
                  : client.status === 'new'
                  ? 'חדש'
                  : client.status === 'followup'
                  ? 'דורש מעקב'
                  : 'לא פעיל'}
              </span>
              <span className="text-sm text-slate-500">מאז {formatDate(new Date(client.startDate))}</span>
            </div>
            {client.phone && <div>📱 {client.phone}</div>}
            {client.email && <div>✉️ {client.email}</div>}
          </div>
        )}

        {/* Goals */}
        {client.goals.length > 0 && (
          <div className="bg-white rounded-lg p-6 border border-slate-200 mb-6">
            <h2 className="font-semibold text-slate-800 mb-3">🎯 מטרות</h2>
            <ul className="space-y-2">
              {client.goals.map((goal, idx) => (
                <li key={idx} className="text-slate-700">
                  • {goal}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Meetings */}
        <div className="bg-white rounded-lg p-6 border border-slate-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowAddMeeting(true)}
              className="text-sm bg-indigo-100 text-indigo-600 px-3 py-1 rounded hover:bg-indigo-200"
            >
              + פגישה
            </button>
            <h2 className="font-semibold text-slate-800">📋 פגישות ({clientMeetings.length})</h2>
          </div>
          {clientMeetings.length === 0 ? (
            <p className="text-slate-500 text-sm">אין פגישות עדיין</p>
          ) : (
            <div className="space-y-3">
              {clientMeetings.slice(0, 5).map((meeting) => (
                <div key={meeting.id} className="border-r-4 border-indigo-400 pl-4 py-2">
                  <div className="font-medium text-slate-800">{meeting.summary.mainTopic}</div>
                  <div className="text-sm text-slate-600">{formatDate(new Date(meeting.date))}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tasks */}
        <div className="bg-white rounded-lg p-6 border border-slate-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowAddTask(true)}
              className="text-sm bg-indigo-100 text-indigo-600 px-3 py-1 rounded hover:bg-indigo-200"
            >
              + משימה
            </button>
            <h2 className="font-semibold text-slate-800">✓ משימות ({clientTasks.length})</h2>
          </div>
          {clientTasks.length === 0 ? (
            <p className="text-slate-500 text-sm">אין משימות</p>
          ) : (
            <div className="space-y-3">
              {clientTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-start gap-3 py-2">
                  <input type="checkbox" checked={task.status === 'completed'} readOnly className="mt-1" />
                  <div className="flex-1">
                    <div className="font-medium text-slate-800">{task.title}</div>
                    <div className="text-sm text-slate-600">ליום {formatDate(new Date(task.dueDate))}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        {client.notes && (
          <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 mb-6">
            <h2 className="font-semibold text-slate-800 mb-3">📝 הערות</h2>
            <p className="text-slate-700 whitespace-pre-wrap">{client.notes}</p>
          </div>
        )}

        {/* Delete Button */}
        <button
          onClick={handleDeleteClient}
          className="w-full bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-lg hover:bg-red-100 transition"
        >
          מחק לקוח
        </button>
      </div>

      {/* Modals */}
      {showAddMeeting && (
        <AddMeetingModal
          clientId={clientId}
          onClose={() => setShowAddMeeting(false)}
        />
      )}
      {showAddTask && (
        <AddTaskModal clientId={clientId} onClose={() => setShowAddTask(false)} />
      )}
    </div>
  )
}
