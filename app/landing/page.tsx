'use client'

import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/30 border-b border-purple-500/20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🤖 Budget Buddy
          </div>
          <Link href="/" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition">
            Launch App →
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-block px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full text-sm">
            ✨ AI-Powered Budget Management in Hebrew
          </div>

          <h1 className="text-6xl md:text-7xl font-bold leading-tight">
            דבר עם{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Buddy
            </span>
            <br />
            על הוצאותיך
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            עוזר תקציב חכם שמבין עברית טבעית. רק כתוב או דבר על הוצאה שלך וBuddy יעשה את השאר.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link
              href="/"
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg font-bold text-lg transition transform hover:scale-105"
            >
              🚀 התחל עכשיו
            </Link>
            <a
              href="https://github.com/jhho567jhho-cmd/home-budget"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-lg font-bold text-lg transition border border-gray-600"
            >
              ⭐ GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-purple-900/30 to-transparent">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            תכונות <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">מדהימות</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🗣️',
                title: 'NLP בעברית',
                description: 'כתוב בשפה טבעית: "קניתי לחם ב-12 שקל" וBuddy יבין',
              },
              {
                icon: '🎤',
                title: 'קול וטקסט',
                description: 'תקליט הוצאות בעברית או כתוב. בחר מה שנוח לך',
              },
              {
                icon: '🧠',
                title: 'AI Coach',
                description: 'עוזר חכם שנותן עצות מיוחדות על בסיס הוצאותיך',
              },
              {
                icon: '📊',
                title: 'אנליטיקה חכמה',
                description: 'זיהוי דפוסים חוזרים והצעות לחיסכון אוטומטית',
              },
              {
                icon: '💾',
                title: 'ייצוא נתונים',
                description: 'הורד את הוצאותיך כJSON, CSV או דוח יפה',
              },
              {
                icon: '🔒',
                title: 'פרטיות מלאה',
                description: 'כל הנתונים שלך בדפדפן. אין אחסון בעננים',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-6 bg-gradient-to-br from-purple-900/50 to-gray-900/50 border border-purple-500/30 rounded-lg hover:border-purple-500/60 transition group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            איך זה עובד?
          </h2>

          <div className="space-y-8">
            {[
              {
                step: 1,
                title: 'כתוב או דבר',
                description: 'הוסף הוצאה בשפה טבעית או בקול',
              },
              {
                step: 2,
                title: 'Buddy מנתח',
                description: 'ה-AI מחלץ סכום, קטגוריה וכו׳ אוטומטית',
              },
              {
                step: 3,
                title: 'יצוג חכם',
                description: 'הנתונים מתעדכנים בדיוק אמיתי',
              },
              {
                step: 4,
                title: 'עצות AI',
                description: 'קבל הצעות מחנכות לחיסכון וניהול תקציב',
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-purple-900/20 to-transparent">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 text-center">
          {[
            { label: 'Lines of Code', value: '3000+' },
            { label: 'Components', value: '8' },
            { label: 'Features', value: '50+' },
            { label: 'Documentation Pages', value: '7' },
          ].map((stat, idx) => (
            <div key={idx}>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <p className="text-gray-400 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            בנוי על טכנולוגיות <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">מתקדמות</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-gray-900/50 border border-gray-700 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Frontend</h3>
              <ul className="space-y-2 text-gray-300">
                <li>✅ Next.js 14 - Framework מהיר</li>
                <li>✅ React 18 - UI Components</li>
                <li>✅ TypeScript - Type Safety</li>
                <li>✅ Tailwind CSS - Modern Styling</li>
              </ul>
            </div>
            <div className="p-6 bg-gray-900/50 border border-gray-700 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Backend & AI</h3>
              <ul className="space-y-2 text-gray-300">
                <li>✅ Custom NLP Engine - Hebrew Processing</li>
                <li>✅ Web Speech API - Voice Recognition</li>
                <li>✅ LocalStorage - Data Persistence</li>
                <li>✅ PostgreSQL Ready - Future DB</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-5xl font-bold">
            מוכנים לשלוט{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              בתקציב שלכם?
            </span>
          </h2>

          <p className="text-xl text-gray-300">
            התחיל עכשיו בחינם. אין כרטיס אשראי נדרש.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/"
              className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg font-bold text-lg transition transform hover:scale-105"
            >
              🚀 התחל עכשיו
            </Link>
            <a
              href="https://github.com/jhho567jhho-cmd/home-budget/blob/budget-buddy-nlp/GETTING_STARTED.md"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 bg-gray-800 hover:bg-gray-700 rounded-lg font-bold text-lg transition border border-gray-600"
            >
              📖 קרא עוד
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4 text-center text-gray-400">
        <p>Made with ❤️ by Claude Haiku 4.5 | Open Source Project</p>
        <p className="mt-2">
          <a href="https://github.com/jhho567jhho-cmd/home-budget" className="text-purple-400 hover:text-purple-300">
            GitHub
          </a>
          {' • '}
          <a href="https://github.com/jhho567jhho-cmd/home-budget/blob/budget-buddy-nlp/LICENSE" className="text-purple-400 hover:text-purple-300">
            License
          </a>
          {' • '}
          <a href="https://github.com/jhho567jhho-cmd/home-budget/blob/budget-buddy-nlp/CONTRIBUTING.md" className="text-purple-400 hover:text-purple-300">
            Contributing
          </a>
        </p>
      </footer>
    </div>
  )
}
