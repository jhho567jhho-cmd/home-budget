'use client'

import { useState, useMemo } from 'react'
import { getCurrentDate, getGreeting } from '@/app/utils/dateUtils'
import { useMeetings } from '@/app/context/MeetingsContext'
import { useTasks } from '@/app/context/TasksContext'
import { useClients } from '@/app/context/ClientsContext'
import { useExpenses } from '@/app/context/ExpensesContext'
import SpendingAnalytics from '@/app/components/SpendingAnalytics'

interface HomeScreenProps {
  userEmail: string
}

export default function HomeScreen({ userEmail }: HomeScreenProps) {
  const [userName] = useState('דנה')
  const currentDate = getCurrentDate()
  const greeting = getGreeting()

  const { meetings, getUpcomingMeetings } = useMeetings()
  const { tasks } = useTasks()
  const { clients, getClientsByStatus } = useClients()
  const { expenses } = useExpenses()

  // קבל את האירועים של היום
  const today = new Date().toISOString().split('T')[0]
  const todaysMeetings = useMemo(
    () => meetings.filter((m) => m.date === today),
    [meetings]
  )
  const todaysTasks = useMemo(() => tasks.filter((t) => t.dueDate === today), [tasks])

  // קבל את הפגישה הבאה
  const nextMeeting = useMemo(() => getUpcomingMeetings()[0], [getUpcomingMeetings])

  // לקוחות דורשים מעקב
  const followupClients = useMemo(() => getClientsByStatus('followup'), [getClientsByStatus])

  return (
    <div className="px-4 pt-6 pb-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          {greeting}, {userName}! 👋
        </h1>
        <p className="text-slate-600">{currentDate}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
          <div className="text-3xl font-bold text-blue-600 mb-1">{todaysMeetings.length}</div>
          <div className="text-sm text-slate-600">פגישות היום</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
          <div className="text-3xl font-bold text-green-600 mb-1">
            {todaysTasks.filter((t) => t.status !== 'completed').length}
          </div>
          <div className="text-sm text-slate-600">משימות להיום</div>
        </div>
      </div>

      {/* Spending Analytics */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">💰 ניתוח הוצאות</h2>
        <SpendingAnalytics expenses={expenses} monthlyBudget={10000} />
      </div>

      {/* Today's Meetings */}
      {todaysMeetings.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">📋 פגישות היום</h2>
          <div className="space-y-3">
            {todaysMeetings.map((meeting) => (
              <div key={meeting.id} className="border-r-4 border-blue-400 pl-4 py-2">
                <div className="font-semibold text-slate-800">
                  {meeting.time} • {meeting.summary.mainTopic}
                </div>
                <div className="text-sm text-slate-600 mt-1">
                  {meeting.type === 'session'
                    ? '🎯 הפגשה'
                    : meeting.type === 'assessment'
                    ? '📊 הערכה'
                    : meeting.type === 'followup'
                    ? '🔄 מעקב'
                    : '💼 ייעוץ'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Tasks */}
      {todaysTasks.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">✓ משימות להיום</h2>
          <div className="space-y-2">
            {todaysTasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-3 py-2 ${
                  task.status === 'completed' ? 'opacity-60' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={task.status === 'completed'}
                  readOnly
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <div className="font-medium text-slate-800">{task.title}</div>
                  <div className="text-xs text-slate-600">
                    {task.dueTime && `⏰ ${task.dueTime}`}
                    {task.priority && (
                      <span className="ml-2">
                        {task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Meeting */}
      {nextMeeting && (
        <div className="bg-indigo-50 rounded-lg shadow-sm p-6 mb-6 border border-indigo-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">📌 הפגישה הבאה</h2>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-slate-600">📅 </span>
              <span className="text-slate-800">
                {new Date(nextMeeting.date).toLocaleDateString('he-IL')} ב-{nextMeeting.time}
              </span>
            </div>
            <div>
              <span className="text-sm text-slate-600">📋 </span>
              <span className="text-slate-800 font-semibold">{nextMeeting.summary.mainTopic}</span>
            </div>
          </div>
        </div>
      )}

      {/* Clients needing follow-up */}
      {followupClients.length > 0 && (
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 mb-6">
          <h3 className="font-semibold text-amber-900 mb-2">⚠️ לקוחות דורשים מעקב ({followupClients.length})</h3>
          <div className="space-y-1">
            {followupClients.slice(0, 3).map((client) => (
              <div key={client.id} className="text-sm text-amber-800">
                • {client.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Assistant Button */}
      <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg p-4 font-semibold hover:shadow-lg transition">
        🤖 שחח עם העוזרת שלי
      </button>
    </div>
  )
}
