'use client'

import { useState } from 'react'
import BottomNav, { type TabType } from '../components/BottomNav'
import HomeScreen from '../components/screens/HomeScreen'
import CalendarScreen from '../components/screens/CalendarScreen'
import AIScreen from '../components/screens/AIScreen'
import KnowledgeBaseScreen from '../components/screens/KnowledgeBaseScreen'
import MoreScreen from '../components/screens/MoreScreen'
import SettingsScreen from '../components/screens/SettingsScreen'
import AnalyticsScreen from '../components/screens/AnalyticsScreen'

type MoreSubTab = 'main' | 'settings' | 'analytics'

interface HomeProps {
  userEmail: string
  onLogout: () => void
}

export default function Home({ userEmail, onLogout }: HomeProps) {
  const [activeTab, setActiveTab] = useState<TabType>('home')
  const [moreSubTab, setMoreSubTab] = useState<MoreSubTab>('main')

  const handleMoreNavigation = (subTab: string) => {
    if (subTab === 'settings' || subTab === 'analytics') {
      setMoreSubTab(subTab as MoreSubTab)
    } else {
      setActiveTab(subTab as TabType)
    }
  }

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    if (tab === 'more') {
      setMoreSubTab('main')
    }
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen userEmail={userEmail} />
      case 'calendar':
        return <CalendarScreen />
      case 'ai':
        return <AIScreen />
      case 'knowledge':
        return <KnowledgeBaseScreen userEmail={userEmail} />
      case 'more':
        if (moreSubTab === 'settings') {
          return <SettingsScreen onBack={() => setMoreSubTab('main')} />
        }
        if (moreSubTab === 'analytics') {
          return <AnalyticsScreen onBack={() => setMoreSubTab('main')} />
        }
        return <MoreScreen onLogout={onLogout} onNavigate={handleMoreNavigation} />
      default:
        return <HomeScreen userEmail={userEmail} />
    }
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Main content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {renderScreen()}
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  )
}
