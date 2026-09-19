import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: 'NLP Coach - עוזרת מקצועית',
  description: 'אפליקציה פרטית למאמנת/מטפלת NLP',
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
      <body className="bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
        {children}
      </body>
    </html>
  )
}
