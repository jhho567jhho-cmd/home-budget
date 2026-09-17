'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-indigo-600">תקציב הבית</h1>
          <p className="text-gray-600 mt-2">ניהול חכם של הוצאות ומלאי</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1: Expense Tracking */}
          <Link href="/expenses">
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full">
              <div className="p-8">
                <div className="text-4xl mb-4">📋</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">ניהול הוצאות</h2>
                <p className="text-gray-600 mb-4">
                  עקוב אחרי הוצאות לפי קטגוריות, תאריכים וכמויות
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>✓ תאריך וסוגי הוצאות</li>
                  <li>✓ קטגוריות הוצאות</li>
                  <li>✓ דוחות ותמצאות</li>
                </ul>
              </div>
            </div>
          </Link>

          {/* Feature 2: Inventory */}
          <Link href="/inventory">
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full">
              <div className="p-8">
                <div className="text-4xl mb-4">📦</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">מעקב מלאי</h2>
                <p className="text-gray-600 mb-4">
                  ניהול חומרים, מלאי וזיהוי תאריכי פקיעה
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>✓ רמות מלאי של חומרים</li>
                  <li>✓ תאריכי תפוקה וזיהוי קרוב</li>
                  <li>✓ הודעות כשגמר משהו</li>
                </ul>
              </div>
            </div>
          </Link>

          {/* Feature 3: Savings Calculator */}
          <Link href="/savings">
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full">
              <div className="p-8">
                <div className="text-4xl mb-4">💰</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">מחשבון חיסכון</h2>
                <p className="text-gray-600 mb-4">
                  חישוב הזדמנויות חיסכון והשוואת מחירים
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>✓ ניתוח הוצאות חוזרות</li>
                  <li>✓ השוואת מחירים</li>
                  <li>✓ הצעות לחיסכון</li>
                </ul>
              </div>
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-gray-600">
          <p>© 2026 תקציב הבית. כל הזכויות שמורות.</p>
        </div>
      </footer>
    </div>
  )
}
