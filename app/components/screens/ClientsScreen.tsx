'use client'

import { useState } from 'react'

export default function ClientsScreen() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'new' | 'followup'>('all')

  return (
    <div className="px-4 pt-6 pb-6 max-w-2xl mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold text-slate-800 mb-6">👥 הלקוחות שלי</h1>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="חפש לקוח..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-right"
          dir="rtl"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { id: 'all', label: 'הכול' },
          { id: 'active', label: 'פעילים' },
          { id: 'new', label: 'חדשים' },
          { id: 'followup', label: 'דורשים מעקב' },
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => setFilterStatus(filter.id as typeof filterStatus)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
              filterStatus === filter.id
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-slate-300 text-slate-700'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Clients list (empty state) */}
      <div className="bg-white rounded-lg shadow-sm p-12 text-center mb-6 border border-slate-200">
        <div className="text-5xl mb-4">👤</div>
        <p className="text-slate-600 mb-6">אין לקוחות עדיין</p>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
          + הוסף לקוח חדש
        </button>
      </div>
    </div>
  )
}
