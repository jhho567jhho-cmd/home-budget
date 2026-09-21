import type { Metadata } from 'next'
import './styles/globals.css'
import { MealsProvider } from './contexts/MealsContext'
import { HabitsProvider } from './contexts/HabitsContext'
import { ProfileProvider } from './contexts/ProfileContext'
import { ConversationProvider } from './contexts/ConversationContext'

export const metadata: Metadata = {
  title: 'LifeBalance - ניהול יום ויום',
  description: 'אפליקציה לתכנון ארוחות ומעקב הרגלים עם עוזר AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <body className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
        <ProfileProvider>
          <ConversationProvider>
            <MealsProvider>
              <HabitsProvider>
                {children}
              </HabitsProvider>
            </MealsProvider>
          </ConversationProvider>
        </ProfileProvider>
      </body>
    </html>
  )
}
