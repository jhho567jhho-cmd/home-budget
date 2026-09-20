'use client'

import { useState, useEffect } from 'react'
import { useJournal } from '@/app/context/JournalContext'

export default function DailyJournal() {
  const { getTodayEntry, addEntry, updateEntry } = useJournal()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState<'great' | 'good' | 'okay' | 'bad'>('good')
  const [isSaved, setIsSaved] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const today = new Date().toISOString().split('T')[0]
  const todayEntry = getTodayEntry()

  useEffect(() => {
    if (todayEntry) {
      setTitle(todayEntry.title)
      setContent(todayEntry.content)
      setMood(todayEntry.mood)
      setIsEditing(true)
    }
  }, [todayEntry])

  const handleSave = () => {
    if (!title.trim()) {
      alert('בבקשה כתוב כותרת ליומן')
      return
    }

    if (isEditing && todayEntry) {
      updateEntry(todayEntry.id, {
        title,
        content,
        mood,
      })
    } else {
      addEntry({
        date: today,
        title,
        content,
        mood,
      })
      setIsEditing(true)
    }

    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  const moodEmoji = {
    great: '😄',
    good: '😊',
    okay: '😐',
    bad: '😔',
  }

  return (
    <div className="bg-white/95 rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800">📝 יומן אישי</h2>
        <span className="text-3xl">{moodEmoji[mood]}</span>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">כותרת</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="מה בדעתך היום?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-slate-900 placeholder-gray-400"
          />
        </div>

        {/* Mood Selector */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">איך אתה מרגיש היום?</label>
          <div className="flex gap-2">
            {(['great', 'good', 'okay', 'bad'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMood(m)}
                className={`flex-1 py-2 px-3 rounded-lg transition ${
                  mood === m
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-xl">{moodEmoji[m]}</span>
                <div className="text-xs mt-1">
                  {m === 'great' && 'מעולה'}
                  {m === 'good' && 'טוב'}
                  {m === 'okay' && 'בסדר'}
                  {m === 'bad' && 'קשה'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">הרשומה שלי</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="כתוב כאן את המחשבות והרגשות שלך..."
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none bg-white text-slate-900 placeholder-gray-400"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className={`w-full font-semibold py-3 rounded-lg transition text-white text-lg ${
            isSaved
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isSaved ? '✅ נשמר בהצלחה!' : '💾 שמור יומן'}
        </button>
      </div>
    </div>
  )
}
