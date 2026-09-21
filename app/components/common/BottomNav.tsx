'use client'

import { TabType } from '../../page'

interface BottomNavProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'home', label: 'היום', icon: '🏠' },
    { id: 'meals', label: 'ארוחות', icon: '🍽️' },
    { id: 'habits', label: 'הרגלים', icon: '🔥' },
    { id: 'stats', label: 'דוחות', icon: '📊' },
    { id: 'ai', label: 'עוזר', icon: '🤖' },
    { id: 'profile', label: 'פרופיל', icon: '👤' },
  ]

  return (
    <nav className="bottom-nav h-20 flex justify-around items-end px-2 py-3 safe-bottom">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all ${
            activeTab === tab.id
              ? 'bg-blue-500/30 text-blue-300 shadow-lg shadow-blue-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="text-2xl">{tab.icon}</span>
          <span className="text-xs font-medium">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
