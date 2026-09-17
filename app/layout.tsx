import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Budget Buddy - עוזר תקציב חכם',
  description: 'עוזר AI אינטליגנטי לניהול תקציב בעברית',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <body className="bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white">
        {children}
      </body>
    </html>
  )
}
