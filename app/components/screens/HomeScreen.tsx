'use client'

import { useProfile } from '../../contexts/ProfileContext'
import { useMeals } from '../../contexts/MealsContext'
import { useHabits } from '../../contexts/HabitsContext'
import TodayProgress from '../common/TodayProgress'
import MealCard from '../common/MealCard'
import HabitCheckBox from '../common/HabitCheckBox'
import QuickAIButton from '../common/QuickAIButton'

export default function HomeScreen() {
  const { profile } = useProfile()
  const { meals } = useMeals()
  const { habits, toggleHabit, getCompletionPercentage } = useHabits()

  const completionPercentage = getCompletionPercentage()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'בוקר טוב 🌅'
    if (hour < 18) return 'אחר הצהריים טוב 🌤️'
    return 'ערב טוב 🌙'
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 animate-fadeIn">
      {/* כותרת ובדיקת שלום */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{getGreeting()}</h1>
        <p className="text-slate-400">שלום, {profile?.name}! 👋</p>
      </div>

      {/* התקדמות היום */}
      <div className="mb-8">
        <TodayProgress percentage={completionPercentage} />
      </div>

      {/* ארוחות היום */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>🍽️</span>
          <span>ארוחות היום</span>
        </h2>
        <div className="space-y-3">
          {meals && meals.meals.length > 0 ? (
            meals.meals.map(meal => (
              <MealCard key={meal.id} meal={meal} />
            ))
          ) : (
            <div className="card text-center text-slate-400 py-6">
              <p>אין ארוחות תוכננו עדיין</p>
              <p className="text-sm mt-2">📌 עבור לכרטיסייה "ארוחות" כדי להוסיף</p>
            </div>
          )}
        </div>
      </div>

      {/* הרגלים היום */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>🔥</span>
          <span>הרגלים היום</span>
        </h2>
        <div className="space-y-3">
          {habits && habits.habits.length > 0 ? (
            habits.habits.map(habit => (
              <HabitCheckBox
                key={habit.id}
                habit={habit}
                onToggle={() => toggleHabit(habit.id)}
              />
            ))
          ) : (
            <div className="card text-center text-slate-400 py-6">
              <p>אין הרגלים עדיין</p>
            </div>
          )}
        </div>
      </div>

      {/* כפתור AI */}
      <div className="mb-6">
        <QuickAIButton />
      </div>

      {/* מידע יומי */}
      <div className="card text-sm">
        <p className="text-slate-300">
          ✨ <strong>טיפ היום:</strong> השלימו את כל ההרגלים כדי לקבל נקודות בונוס!
        </p>
      </div>
    </div>
  )
}
