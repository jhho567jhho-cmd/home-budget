'use client'

import { useMeals } from '../../contexts/MealsContext'
import { useHabits } from '../../contexts/HabitsContext'

export default function StatsScreen() {
  const { meals } = useMeals()
  const { habits } = useHabits()

  const totalCalories = meals?.meals.reduce((sum, meal) => sum + (meal.calories || 0), 0) || 0
  const completedMeals = meals?.meals.filter(m => m.completed).length || 0
  const completedHabits = habits?.habits.filter(h => h.completed).length || 0
  const maxStreak = habits?.habits.reduce((max, h) => Math.max(max, h.streak), 0) || 0

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 animate-fadeIn">
      <h1 className="text-3xl font-bold mb-6">📊 דוחות וסטטיסטיקות</h1>

      {/* סטטיסטיקות עיקריות */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="card text-center">
          <p className="text-slate-400 text-sm mb-2">🔥 הרגלים הושלמו</p>
          <p className="text-3xl font-bold text-green-400">{completedHabits}</p>
          <p className="text-xs text-slate-500 mt-1">מתוך {habits?.habits.length}</p>
        </div>

        <div className="card text-center">
          <p className="text-slate-400 text-sm mb-2">🍽️ ארוחות הושלמו</p>
          <p className="text-3xl font-bold text-blue-400">{completedMeals}</p>
          <p className="text-xs text-slate-500 mt-1">מתוך {meals?.meals.length}</p>
        </div>

        <div className="card text-center">
          <p className="text-slate-400 text-sm mb-2">🔥 סטריק מקסימלי</p>
          <p className="text-3xl font-bold text-orange-400">{maxStreak}</p>
          <p className="text-xs text-slate-500 mt-1">ימים ברציפות</p>
        </div>

        <div className="card text-center">
          <p className="text-slate-400 text-sm mb-2">🔥 קלוריות כוללות</p>
          <p className="text-3xl font-bold text-red-400">{totalCalories}</p>
          <p className="text-xs text-slate-500 mt-1">kcal ביום</p>
        </div>
      </div>

      {/* פירוט הרגלים */}
      <div className="card mb-6">
        <h2 className="font-bold mb-4 text-lg">🔥 סטטיסטיקות הרגלים</h2>
        <div className="space-y-3">
          {habits?.habits.map(habit => (
            <div key={habit.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>{habit.emoji}</span>
                <span className="text-sm">{habit.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${habit.completed ? 'text-green-400' : 'text-slate-400'}`}>
                  {habit.completed ? '✓ הושלם' : '○ בהמתנה'}
                </span>
                {habit.streak > 0 && (
                  <span className="text-sm font-bold text-orange-400">🔥 {habit.streak}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* עצות ודברים טובים */}
      <div className="card bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
        <p className="text-sm">
          ✨ <strong>טיפ:</strong> שמור על עקביות! כל יום שתוציא את ההרגל, אתה בונה סטריק חזק יותר.
        </p>
      </div>
    </div>
  )
}
