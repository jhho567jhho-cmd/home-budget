'use client'

import { useState } from 'react'
import { downloadFile, exportExpensesAsJSON, exportExpensesAsCSV, downloadReport } from '@/app/utils/export'

interface SettingsPanelProps {
  expenses: any[]
  onClearData?: () => void
}

export function SettingsPanel({ expenses, onClearData }: SettingsPanelProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [showExport, setShowExport] = useState(false)

  const handleExportJSON = () => {
    const json = exportExpensesAsJSON(expenses)
    downloadFile(json, 'budget-buddy-export', 'json')
  }

  const handleExportCSV = () => {
    const csv = exportExpensesAsCSV(expenses)
    downloadFile(csv, 'budget-buddy-export', 'csv')
  }

  const handleDownloadReport = () => {
    downloadReport(expenses)
  }

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        // TODO: Import functionality
        alert('יבוא נתונים בקרוב!')
      } catch (error) {
        alert('שגיאה בייבוא הקובץ')
      }
    }
    reader.readAsText(file)
  }

  const handleClearData = () => {
    if (window.confirm('הנך בטוח? לא ניתן לבטל פעולה זו.')) {
      if (onClearData) onClearData()
      alert('כל הנתונים נמחקו')
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg flex items-center justify-center text-xl transition-transform hover:scale-110"
      >
        ⚙️
      </button>

      {/* Settings Menu */}
      {showSettings && (
        <div className="absolute bottom-20 right-0 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2">
          <div className="p-4 bg-gray-800 border-b border-gray-700">
            <h3 className="font-semibold text-white">הגדרות</h3>
          </div>

          <div className="p-4 space-y-3">
            {/* Export Section */}
            <div>
              <button
                onClick={() => setShowExport(!showExport)}
                className="w-full text-right text-sm font-semibold text-indigo-400 hover:text-indigo-300 mb-2"
              >
                📤 ייצוא {showExport ? '▼' : '▶'}
              </button>

              {showExport && (
                <div className="space-y-2 pl-4 border-l border-gray-700">
                  <button
                    onClick={handleExportJSON}
                    className="w-full text-right text-xs px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
                  >
                    📋 JSON
                  </button>
                  <button
                    onClick={handleExportCSV}
                    className="w-full text-right text-xs px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
                  >
                    📊 CSV
                  </button>
                  <button
                    onClick={handleDownloadReport}
                    className="w-full text-right text-xs px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
                  >
                    📄 דוח טקסט
                  </button>
                </div>
              )}
            </div>

            {/* Import Section */}
            <div>
              <label className="block text-right text-sm font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer">
                📥 ייבוא JSON
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>
            </div>

            {/* Statistics */}
            <div className="bg-gray-800 rounded-lg p-3 text-xs">
              <p className="text-gray-400 mb-2">📊 סטטיסטיקות:</p>
              <div className="space-y-1 text-gray-300">
                <p>הוצאות: {expenses.length}</p>
                <p>סה״כ: ₪{expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}</p>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="border-t border-gray-700 pt-3">
              <button
                onClick={handleClearData}
                className="w-full text-right text-xs px-3 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg transition border border-red-900/50"
              >
                🗑️ מחק כל הנתונים
              </button>
            </div>

            {/* Version */}
            <div className="text-center text-xs text-gray-500 pt-2">
              <p>v1.0.0</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
