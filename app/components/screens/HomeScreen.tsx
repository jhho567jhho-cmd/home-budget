'use client'

import { useState, useMemo } from 'react'
import { getCurrentDate, getGreeting } from '@/app/utils/dateUtils'
import { useMeetings } from '@/app/context/MeetingsContext'
import { useTasks } from '@/app/context/TasksContext'
import { useHealth } from '@/app/context/ExpensesContext'
import DailyJournal from '@/app/components/DailyJournal'

interface HomeScreenProps {
  userEmail: string
}

export default function HomeScreen({ userEmail }: HomeScreenProps) {
  const [userName] = useState('דבורה')
  const currentDate = getCurrentDate()
  const greeting = getGreeting()

  const { meetings, getUpcomingMeetings } = useMeetings()
  const { tasks } = useTasks()
  const { entries, addEntry, deleteEntry } = useHealth()

  // קבל את האירועים של היום
  const today = new Date().toISOString().split('T')[0]
  const todaysMeetings = useMemo(
    () => meetings.filter((m) => m.date === today),
    [meetings]
  )
  const todaysTasks = useMemo(() => tasks.filter((t) => t.dueDate === today), [tasks])

  // קבל את הפגישה הבאה
  const nextMeeting = useMemo(() => getUpcomingMeetings()[0], [getUpcomingMeetings])

  // רישומי בריאות של היום
  const todaysHealthEntries = useMemo(
    () => entries.filter((e) => e.date === today),
    [entries]
  )

  return (
    <div className="px-4 pt-6 pb-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {greeting}, {userName}! 👋
        </h1>
        <p className="text-gray-400">{currentDate}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-4 text-center shadow-lg text-white">
          <div className="text-3xl font-bold mb-1">{todaysHealthEntries.length}</div>
          <div className="text-sm opacity-90">רישומים בריאותיים</div>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-4 text-center shadow-lg text-white">
          <div className="text-3xl font-bold mb-1">
            {new Set(todaysHealthEntries.map((e) => e.type)).size}
          </div>
          <div className="text-sm opacity-90">סוגים שונים</div>
        </div>
      </div>

      {/* Today's Health Summary */}
      {todaysHealthEntries.length > 0 && (
        <div className="bg-slate-800 rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">📊 רישומי בריאות היום</h2>
          <div className="space-y-3">
            {todaysHealthEntries.map((entry) => (
              <div key={entry.id} className="border-r-4 border-green-400 pl-4 py-2">
                <div className="font-semibold text-white">{entry.type}</div>
                <div className="text-sm text-gray-400 mt-1">
                  {entry.note}
                </div>
                <div className="text-sm font-medium text-green-400 mt-1">
                  {entry.value} {entry.unit}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Meetings */}
      {todaysMeetings.length > 0 && (
        <div className="bg-slate-800 rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">📋 פגישות היום</h2>
          <div className="space-y-3">
            {todaysMeetings.map((meeting) => (
              <div key={meeting.id} className="border-r-4 border-blue-400 pl-4 py-2">
                <div className="font-semibold text-white">
                  {meeting.time} • {meeting.summary.mainTopic}
                </div>
                <div className="text-sm text-gray-400 mt-1">
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
        <div className="bg-slate-800 rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">✓ משימות להיום</h2>
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
                  <div className="font-medium text-white">{task.title}</div>
                  <div className="text-xs text-gray-400">
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
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-6 mb-6 text-white">
          <h2 className="text-lg font-semibold mb-4">📌 הפגישה הבאה</h2>
          <div className="space-y-2">
            <div>
              <span className="text-sm opacity-90">📅 </span>
              <span className="opacity-90">
                {new Date(nextMeeting.date).toLocaleDateString('he-IL')} ב-{nextMeeting.time}
              </span>
            </div>
            <div>
              <span className="text-sm opacity-90">📋 </span>
              <span className="font-semibold">{nextMeeting.summary.mainTopic}</span>
            </div>
          </div>
        </div>
      )}


      {/* Daily Journal */}
      <div className="mb-6">
        <DailyJournal />
      </div>

      {/* AI Assistant Button */}
      <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg p-4 font-semibold hover:shadow-lg transition">
        🤖 שחח עם העוזרת שלי
      </button>
    </div>
  )
}
