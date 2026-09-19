'use client'

import { useState } from 'react'
import { useClients } from '@/app/context/ClientsContext'
import { ClientStatus } from '@/app/types'
import AddClientModal from '../modals/AddClientModal'

type FilterStatus = 'all' | 'active' | 'new' | 'followup'

export default function ClientsScreen() {
  const { clients, searchClients, getClientsByStatus } = useClients()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [showAddModal, setShowAddModal] = useState(false)

  // סנן לקוחות לפי חיפוש וסטטוס
  let displayedClients = searchTerm ? searchClients(searchTerm) : clients

  if (filterStatus !== 'all') {
    const statusMap: Record<FilterStatus, ClientStatus> = {
      all: 'active',
      active: 'active',
      new: 'new',
      followup: 'followup',
    }
    displayedClients = displayedClients.filter((c) => c.status === statusMap[filterStatus])
  }

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
          { id: 'all' as FilterStatus, label: 'הכול' },
          { id: 'active' as FilterStatus, label: 'פעילים' },
          { id: 'new' as FilterStatus, label: 'חדשים' },
          { id: 'followup' as FilterStatus, label: 'דורשים מעקב' },
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => setFilterStatus(filter.id)}
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

      {/* Clients list */}
      {displayedClients.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center mb-6 border border-slate-200">
          <div className="text-5xl mb-4">👤</div>
          <p className="text-slate-600 mb-6">אין לקוחות</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            + הוסף לקוח חדש
          </button>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {displayedClients.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-lg shadow-sm p-4 border border-slate-200 hover:shadow-md transition cursor-pointer text-right"
            >
              <div className="font-semibold text-slate-800">{client.name}</div>
              {client.phone && <div className="text-sm text-slate-600">📱 {client.phone}</div>}
              {client.email && <div className="text-sm text-slate-600">✉️ {client.email}</div>}
              <div className="mt-2 flex gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
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
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add button (always visible) */}
      {displayedClients.length > 0 && (
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
        >
          + לקוח חדש
        </button>
      )}

      {/* Add Client Modal */}
      {showAddModal && <AddClientModal onClose={() => setShowAddModal(false)} />}
    </div>
  )
}
