'use client'

import { Meal } from '../../types'
import { useMeals } from '../../contexts/MealsContext'

interface MealCardProps {
  meal: Meal
}

export default function MealCard({ meal }: MealCardProps) {
  const { toggleMeal, removeMeal } = useMeals()

  const getMealEmoji = () => {
    switch (meal.type) {
      case 'breakfast':
        return '🍳'
      case 'snack':
        return '☕'
      case 'lunch':
        return '🍗'
      case 'dinner':
        return '🥗'
      default:
        return '🍽️'
    }
  }

  const getMealLabel = () => {
    switch (meal.type) {
      case 'breakfast':
        return 'ארוחת בוקר'
      case 'snack':
        return 'ארוחת ביניים'
      case 'lunch':
        return 'ארוחת צהריים'
      case 'dinner':
        return 'ארוחת ערב'
      default:
        return 'ארוחה'
    }
  }

  return (
    <div
      className={`card card-hover ${meal.completed ? 'opacity-60 border-green-600' : ''}`}
    >
      <div className="flex items-start gap-4">
        <div className="text-3xl">{getMealEmoji()}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-lg">{meal.name}</h3>
            <span className="text-sm text-slate-400">{meal.time}</span>
          </div>
          <p className="text-sm text-slate-400 mb-2">{getMealLabel()}</p>
          {meal.calories && (
            <p className="text-xs text-slate-500">
              🔥 {meal.calories} קלוריות
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => toggleMeal(meal.id)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              meal.completed
                ? 'bg-green-500 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
            }`}
          >
            {meal.completed ? '✓' : '○'}
          </button>
          <button
            onClick={() => removeMeal(meal.id)}
            className="w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-400 flex items-center justify-center transition-all text-sm"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}
