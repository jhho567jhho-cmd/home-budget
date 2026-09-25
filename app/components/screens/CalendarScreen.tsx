'use client'

import { useState, useMemo } from 'react'
import { useMeetings } from '@/app/context/MeetingsContext'
import { useTasks } from '@/app/context/TasksContext'
import { formatDate } from '@/app/utils/dateUtils'
import AddMeetingModal from '../modals/AddMeetingModal'
import MeetingDetailsModal from '../modals/MeetingDetailsModal'

type ViewMode = 'day' | 'week'

interface DayEvent {
  id: string
  type: 'meeting' | 'task'
  title: string
  time?: string
  data: any
}

export default function CalendarScreen() {
  const { meetings } = useMeetings()
  const { tasks } = useTasks()

  const [viewMode, setViewMode] = useState<ViewMode>('day')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showAddMeeting, setShowAddMeeting] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null)

  // קבל את הימים בשבוע
  const getWeekDates = (date: Date) => {
    const week = []
    const curr = new Date(date)
    const first = curr.getDate() - curr.getDay()

    for (let i = 0; i < 7; i++) {
      const day = new Date(curr.setDate(first + i))
      week.push(new Date(day))
    }
    return week
  }

  // קבל את האירועים לתאריך מסוים
  const getEventsForDate = (date: Date): DayEvent[] => {
    const dateStr = date.toISOString().split('T')[0]
    const events: DayEvent[] = []

    // הוסף פגישות
    meetings
      .filter((m) => m.date === dateStr)
      .forEach((m) => {
        events.push({
          id: m.id,
          type: 'meeting',
          title: m.summary.mainTopic,
          time: m.time,
          data: m,
        })
      })

    // הוסף משימות
    tasks
      .filter((t) => t.dueDate === dateStr)
      .forEach((t) => {
        events.push({
          id: t.id,
          type: 'task',
          title: t.title,
          time: t.dueTime,
          data: t,
        })
      })

    // מיין לפי שעה
    return events.sort((a, b) => {
      const timeA = a.time || '99:00'
      const timeB = b.time || '99:00'
      return timeA.localeCompare(timeB)
    })
  }

  // קבל את הזמן הנוכחי
  const getCurrentTime = () => {
    const now = new Date()
    return now.toTimeString().slice(0, 5)
  }

  const currentTime = getCurrentTime()

  // Day View
  const dayEvents = useMemo(() => getEventsForDate(selectedDate), [selectedDate, meetings, tasks])

  // Week View
  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate])

  const navigateDay = (days: number) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + days)
    setSelectedDate(newDate)
  }

  const navigateWeek = (weeks: number) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + weeks * 7)
    setSelectedDate(newDate)
  }

  const goToToday = () => {
    setSelectedDate(new Date())
  }

  return (
    <div className="pb-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-4 z-10">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">📅 היומן שלי</h1>

        {/* View toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setViewMode('day')}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${
              viewMode === 'day'
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            יום
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${
              viewMode === 'week'
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            שבוע
          </button>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => (viewMode === 'day' ? navigateDay(-1) : navigateWeek(-1))}
            className="text-2xl text-slate-600 hover:text-slate-800"
          >
            ←
          </button>
          <button
            onClick={goToToday}
            className="text-sm bg-indigo-100 text-indigo-600 px-3 py-1 rounded hover:bg-indigo-200"
          >
            היום
          </button>
          <button
            onClick={() => (viewMode === 'day' ? navigateDay(1) : navigateWeek(1))}
            className="text-2xl text-slate-600 hover:text-slate-800"
          >
            →
          </button>
        </div>
      </div>

      <div className="px-4 pt-6">
        {/* Day View */}
        {viewMode === 'day' && (
          <div>
            {/* Date header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                {selectedDate.toLocaleDateString('he-IL', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h2>
            </div>

            {/* Add meeting button */}
            <button
              onClick={() => setShowAddMeeting(true)}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold mb-6"
            >
              + פגישה חדשה
            </button>

            {/* Events */}
            {dayEvents.length === 0 ? (
              <div className="bg-slate-50 rounded-lg p-8 text-center border border-slate-200">
                <div className="text-5xl mb-4">📭</div>
                <p className="text-slate-600">אין פגישות או משימות בתאריך זה</p>
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                {/* Timeline */}
                {dayEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => event.type === 'meeting' && setSelectedMeeting(event.data)}
                    className={`w-full p-4 rounded-lg border-r-4 text-right transition hover:shadow-md ${
                      event.type === 'meeting'
                        ? 'bg-blue-50 border-blue-400 hover:bg-blue-100'
                        : 'bg-amber-50 border-amber-400 hover:bg-amber-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-2xl">
                        {event.type === 'meeting' ? '📋' : '✓'}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-800">
                          {event.time && <span className="text-sm text-slate-600">{event.time} • </span>}
                          {event.title}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {event.type === 'task' ? '✓ משימה' : '📅 פגישה'}
                        </div>
                        {event.type === 'task' && event.data.priority && (
                          <div className="text-xs mt-2">
                            {event.data.priority === 'high'
                              ? '🔴 גבוהה'
                              : event.data.priority === 'medium'
                              ? '🟡 בינונית'
                              : '🟢 נמוכה'}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Week View */}
        {viewMode === 'week' && (
          <div>
            {/* Week header */}
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold text-slate-800">
                שבוע של {weekDates[0].toLocaleDateString('he-IL', { month: 'long', day: 'numeric' })} -{' '}
                {weekDates[6].toLocaleDateString('he-IL', { month: 'long', day: 'numeric' })}
              </h2>
            </div>

            {/* Add meeting button */}
            <button
              onClick={() => setShowAddMeeting(true)}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold mb-6"
            >
              + פגישה חדשה
            </button>

            {/* Days grid */}
            <div className="space-y-3 mb-6">
              {weekDates.map((date, idx) => {
                const isToday = new Date().toDateString() === date.toDateString()
                const events = getEventsForDate(date)
                const dayName = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'][idx]

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-r-4 ${
                      isToday
                        ? 'border-indigo-400 bg-indigo-50'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <button
                      onClick={() => setSelectedDate(date)}
                      className="w-full text-right hover:opacity-80 transition"
                    >
                      <div className="font-semibold text-slate-800">
                        {dayName} • {date.toLocaleDateString('he-IL', { month: 'numeric', day: 'numeric' })}
                        {isToday && ' 📍'}
                      </div>
                    </button>

                    {/* Events in week view */}
                    {events.length > 0 && (
                      <div className="mt-2 space-y-2 text-sm">
                        {events.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={`p-2 rounded text-xs text-right ${
                              event.type === 'meeting'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {event.time && <span>{event.time} • </span>}
                            {event.title}
                          </div>
                        ))}
                        {events.length > 2 && (
                          <div className="text-xs text-slate-500">
                            ו-{events.length - 2} עוד...
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddMeeting && (
        <AddMeetingModal
          clientId=""
          onClose={() => setShowAddMeeting(false)}
        />
      )}
      {selectedMeeting && (
        <MeetingDetailsModal
          meeting={selectedMeeting}
          onClose={() => setSelectedMeeting(null)}
        />
      )}
    </div>
  )
}
