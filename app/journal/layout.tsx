'use client'

import { JournalProvider } from '@/app/context/JournalContext'

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <JournalProvider>{children}</JournalProvider>
}
