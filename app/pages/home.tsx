'use client'

import { useState } from 'react'
import BottomNav, { type TabType } from '../components/BottomNav'
import HomeScreen from '../components/screens/HomeScreen'
import ClientsScreen from '../components/screens/ClientsScreen'
import ClientDetailScreen from '../components/screens/ClientDetailScreen'
import CalendarScreen from '../components/screens/CalendarScreen'
import AIScreen from '../components/screens/AIScreen'
import KnowledgeBaseScreen from '../components/screens/KnowledgeBaseScreen'
import MoreScreen from '../components/screens/MoreScreen'
import SettingsScreen from '../components/screens/SettingsScreen'

type MoreSubTab = 'main' | 'settings'

interface HomeProps {
  userEmail: string
  onLogout: () => void
}

export default function Home({ userEmail, onLogout }: HomeProps) {
  const [activeTab, setActiveTab] = useState<TabType>('home')
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [moreSubTab, setMoreSubTab] = useState<MoreSubTab>('main')

  const handleMoreNavigation = (subTab: string) => {
    if (subTab === 'settings') {
      setMoreSubTab('settings')
    } else {
      setActiveTab(subTab as TabType)
    }
  }

  const renderScreen = () => {
    // אם בחרנו לקוח, הצג את מסך הפרטים
    if (selectedClientId) {
      return (
        <ClientDetailScreen
          clientId={selectedClientId}
          onBack={() => setSelectedClientId(null)}
        />
      )
    }

    switch (activeTab) {
      case 'home':
        return <HomeScreen userEmail={userEmail} />
      case 'clients':
        return <ClientsScreen onSelectClient={setSelectedClientId} />
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
        return <MoreScreen onLogout={onLogout} onNavigate={handleMoreNavigation} />
      default:
        return <HomeScreen userEmail={userEmail} />
    }
  }

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    // Reset more sub-tab when switching to more
    if (tab === 'more') {
      setMoreSubTab('main')
    }
  }

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      {/* Main content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {renderScreen()}
      </div>

      {/* Bottom Navigation - לא מוצג כשמצפים מסך לקוח */}
      {!selectedClientId && <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />}
    </div>
  )
}
