'use client'

import { ExpensesProvider } from '@/app/context/ExpensesContext'

export default function ExpensesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ExpensesProvider>{children}</ExpensesProvider>
}
