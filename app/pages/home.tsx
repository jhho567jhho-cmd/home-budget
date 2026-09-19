'use client'

import { useState } from 'react'
import BottomNav from '../components/BottomNav'
import HomeScreen from '../components/screens/HomeScreen'
import ClientsScreen from '../components/screens/ClientsScreen'
import ClientDetailScreen from '../components/screens/ClientDetailScreen'
import CalendarScreen from '../components/screens/CalendarScreen'
import AIScreen from '../components/screens/AIScreen'
import MoreScreen from '../components/screens/MoreScreen'

type TabType = 'home' | 'clients' | 'calendar' | 'ai' | 'more'

interface HomeProps {
  userEmail: string
  onLogout: () => void
}

export default function Home({ userEmail, onLogout }: HomeProps) {
  const [activeTab, setActiveTab] = useState<TabType>('home')
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)

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
      case 'more':
        return <MoreScreen onLogout={onLogout} />
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

      {/* Bottom Navigation - לא מוצג כשמצפים מסך לקוח */}
      {!selectedClientId && <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />}
    </div>
  )
}
