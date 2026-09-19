'use client'

import { useState } from 'react'
import { getCurrentDate, getGreeting } from '@/app/utils/dateUtils'

interface HomeScreenProps {
  userEmail: string
}

export default function HomeScreen({ userEmail }: HomeScreenProps) {
  const [userName] = useState('דנה') // כרגע - בהמשך יתמלא מהמסד
  const currentDate = getCurrentDate()
  const greeting = getGreeting()

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
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-1">0</div>
          <div className="text-sm text-slate-600">פגישות היום</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-600 mb-1">0</div>
          <div className="text-sm text-slate-600">משימות להיום</div>
        </div>
      </div>

      {/* Next Meeting */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">📌 הפגישה הבאה</h2>
        <div className="text-center py-6 text-slate-500">
          אין פגישות קרובות
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">⚡ פעולות מהירות</h2>
        <div className="grid grid-cols-1 gap-3">
          <button className="bg-white border border-slate-200 rounded-lg p-4 text-right hover:bg-slate-50 transition">
            <div className="font-semibold text-slate-800">+ לקוח חדש</div>
            <div className="text-sm text-slate-600">הוסף לקוח חדש</div>
          </button>
          <button className="bg-white border border-slate-200 rounded-lg p-4 text-right hover:bg-slate-50 transition">
            <div className="font-semibold text-slate-800">+ פגישה חדשה</div>
            <div className="text-sm text-slate-600">תבור פגישה חדשה</div>
          </button>
          <button className="bg-white border border-slate-200 rounded-lg p-4 text-right hover:bg-slate-50 transition">
            <div className="font-semibold text-slate-800">+ משימה חדשה</div>
            <div className="text-sm text-slate-600">הוסף משימה</div>
          </button>
        </div>
      </div>

      {/* AI Assistant Button */}
      <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg p-4 font-semibold hover:shadow-lg transition">
        🤖 שחח עם העוזרת שלי
      </button>

      {/* Clients needing follow-up */}
      <div className="mt-8 bg-amber-50 rounded-lg p-4 border border-amber-200">
        <h3 className="font-semibold text-amber-900 mb-2">⚠️ לקוחות דורשים מעקב</h3>
        <p className="text-sm text-amber-800">אין לקוחות דורשים מעקב כרגע</p>
      </div>
    </div>
  )
}
