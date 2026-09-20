import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: 'Budget Buddy - מנהל תקציב',
  description: 'אפליקציה פרטית לניהול תקציב ביתי',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className="bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 text-white">
        {children}
      </body>
    </html>
  )
}
