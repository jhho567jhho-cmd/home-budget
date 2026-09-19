'use client'

export default function CalendarScreen() {
  return (
    <div className="px-4 pt-6 pb-6 max-w-2xl mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold text-slate-800 mb-6">📅 היומן שלי</h1>

      {/* View options */}
      <div className="flex gap-2 mb-6">
        <button className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-semibold">יום</button>
        <button className="flex-1 bg-white border border-slate-300 text-slate-700 py-2 rounded-lg font-semibold hover:bg-slate-50">שבוע</button>
      </div>

      {/* Calendar (empty state) */}
      <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-slate-200">
        <div className="text-5xl mb-4">📭</div>
        <p className="text-slate-600">אין פגישות או משימות בתאריך זה</p>
      </div>
    </div>
  )
}
