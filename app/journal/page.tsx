'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useJournal } from '@/app/context/JournalContext'

export default function JournalPage() {
  const { entries, deleteEntry } = useJournal()
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const monthEntries = entries.filter((e) => {
    const entryDate = new Date(e.date)
    return entryDate.getMonth() === selectedMonth && entryDate.getFullYear() === selectedYear
  })

  const moodEmoji = {
    great: '😄',
    good: '😊',
    okay: '😐',
    bad: '😔',
  }

  const moodLabel = {
    great: 'מעולה',
    good: 'טוב',
    okay: 'בסדר',
    bad: 'קשה',
  }

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11)
      setSelectedYear(selectedYear - 1)
    } else {
      setSelectedMonth(selectedMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0)
      setSelectedYear(selectedYear + 1)
    } else {
      setSelectedMonth(selectedMonth + 1)
    }
  }

  const monthName = new Date(selectedYear, selectedMonth).toLocaleDateString('he-IL', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-indigo-600">📝 היומן שלי</h1>
              <p className="text-gray-600 mt-2">הרשומות האישיות שלך</p>
            </div>
            <Link href="/" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              ← חזרה לעמוד הבית
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Month Navigation */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevMonth}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              ← חודש קודם
            </button>
            <h2 className="text-2xl font-bold text-slate-800">{monthName}</h2>
            <button
              onClick={handleNextMonth}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              חודש הבא →
            </button>
          </div>
        </div>

        {/* Entries List */}
        {monthEntries.length > 0 ? (
          <div className="space-y-4">
            {monthEntries
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((entry) => {
                const entryDate = new Date(entry.date).toLocaleDateString('he-IL', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })

                return (
                  <div
                    key={entry.id}
                    className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-800">{entry.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">{entryDate}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{moodEmoji[entry.mood]}</span>
                        <span className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                          {moodLabel[entry.mood]}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-700 whitespace-pre-wrap mb-4">{entry.content}</p>

                    <div className="flex gap-3">
                      <Link
                        href={`/journal/${entry.id}`}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
                      >
                        ערוך
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm('האם בטוח שאתה רוצה למחוק רשומה זו?')) {
                            deleteEntry(entry.id)
                          }
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                      >
                        מחק
                      </button>
                    </div>
                  </div>
                )
              })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-2xl mb-2">📭</p>
            <p className="text-slate-600 text-lg">אין רשומות בחודש זה</p>
            <p className="text-slate-500 mt-2">התחל לכתוב את היומן שלך בעמוד הבית!</p>
          </div>
        )}
      </main>
    </div>
  )
}
