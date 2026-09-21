'use client'

import { useState } from 'react'
import BottomNav from './components/common/BottomNav'
import HomeScreen from './components/screens/HomeScreen'
import MealsScreen from './components/screens/MealsScreen'
import HabitsScreen from './components/screens/HabitsScreen'
import StatsScreen from './components/screens/StatsScreen'
import AIAssistantScreen from './components/screens/AIAssistantScreen'
import ProfileScreen from './components/screens/ProfileScreen'

export type TabType = 'home' | 'meals' | 'habits' | 'stats' | 'ai' | 'profile'

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('home')

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />
      case 'meals':
        return <MealsScreen />
      case 'habits':
        return <HabitsScreen />
      case 'stats':
        return <StatsScreen />
      case 'ai':
        return <AIAssistantScreen />
      case 'profile':
        return <ProfileScreen />
      default:
        return <HomeScreen />
    }
  }

  return (
    <div className="container-main">
      <div className="content-area">
        {renderScreen()}
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
