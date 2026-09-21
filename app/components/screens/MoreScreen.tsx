'use client'

interface MoreScreenProps {
  onLogout: () => void
  onNavigate?: (tab: string) => void
}

export default function MoreScreen({ onLogout, onNavigate }: MoreScreenProps) {
  return (
    <div className="px-4 pt-6 pb-6 max-w-2xl mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold text-slate-800 mb-6">⚙️ עוד</h1>

      {/* Menu Items */}
      <div className="space-y-3 mb-8">
        {/* Knowledge Library */}
        <button
          onClick={() => onNavigate?.('knowledge')}
          className="w-full bg-white border border-slate-200 rounded-lg p-4 text-right hover:bg-slate-50 transition flex items-center justify-between"
        >
          <span className="text-2xl">📚</span>
          <div>
            <div className="font-semibold text-slate-800">ספריית הידע שלי</div>
            <div className="text-sm text-slate-600">מסמכים וחומרים מקצועיים</div>
          </div>
        </button>

        {/* Settings */}
        <button
          onClick={() => onNavigate?.('settings')}
          className="w-full bg-white border border-slate-200 rounded-lg p-4 text-right hover:bg-slate-50 transition flex items-center justify-between"
        >
          <span className="text-2xl">⚙️</span>
          <div>
            <div className="font-semibold text-slate-800">הגדרות</div>
            <div className="text-sm text-slate-600">התאם את ההעדפות שלך</div>
          </div>
        </button>

        {/* Privacy */}
        <button className="w-full bg-white border border-slate-200 rounded-lg p-4 text-right hover:bg-slate-50 transition flex items-center justify-between">
          <span className="text-2xl">🔒</span>
          <div>
            <div className="font-semibold text-slate-800">פרטיות ואבטחה</div>
            <div className="text-sm text-slate-600">הגדרות אבטחה</div>
          </div>
        </button>

        {/* About */}
        <button className="w-full bg-white border border-slate-200 rounded-lg p-4 text-right hover:bg-slate-50 transition flex items-center justify-between">
          <span className="text-2xl">ℹ️</span>
          <div>
            <div className="font-semibold text-slate-800">אודות האפליקציה</div>
            <div className="text-sm text-slate-600">גרסה ומידע</div>
          </div>
        </button>
      </div>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg p-4 font-semibold transition"
      >
        התנתק
      </button>

      {/* Footer Info */}
      <div className="mt-8 pt-6 border-t border-slate-200 text-center text-sm text-slate-500">
        <p>NLP Coach • גרסה 1.0</p>
        <p className="mt-2">אפליקציה פרטית עבור משתמשת אחת</p>
      </div>
    </div>
  )
}
