'use client'

import React from 'react'

type TabType = 'home' | 'clients' | 'calendar' | 'ai' | 'more'

interface BottomNavProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const tabs: Array<{
  id: TabType
  label: string
  icon: string
  ariaLabel: string
}> = [
  { id: 'home', label: 'בית', icon: '🏠', ariaLabel: 'דף הבית' },
  { id: 'clients', label: 'לקוחות', icon: '👥', ariaLabel: 'ניהול לקוחות' },
  { id: 'calendar', label: 'יומן', icon: '📅', ariaLabel: 'יומן ופגישות' },
  { id: 'ai', label: 'AI', icon: '🤖', ariaLabel: 'עוזרת AI' },
  { id: 'more', label: 'עוד', icon: '⚙️', ariaLabel: 'עוד אפשרויות' },
]

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg safe-area-inset-bottom"
      role="navigation"
      aria-label="ניווט ראשי"
    >
      <div className="flex items-center justify-around h-20 px-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 flex-1 ${
              activeTab === tab.id
                ? 'bg-indigo-100 text-indigo-600'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            aria-label={tab.ariaLabel}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            <span className="text-2xl">{tab.icon}</span>
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
