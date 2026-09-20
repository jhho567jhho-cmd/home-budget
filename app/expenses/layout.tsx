'use client'

import { ExpensesProvider } from '@/app/context/ExpensesContext'
import { ClientsProvider } from '@/app/context/ClientsContext'

export default function ExpensesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClientsProvider>
      <ExpensesProvider>{children}</ExpensesProvider>
    </ClientsProvider>
  )
}
