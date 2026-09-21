'use client'

import { Habit } from '../../types'

interface HabitCheckBoxProps {
  habit: Habit
  onToggle: () => void
}

export default function HabitCheckBox({ habit, onToggle }: HabitCheckBoxProps) {
  return (
    <div
      className={`card card-hover ${habit.completed ? 'opacity-70 border-green-600' : ''}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-2xl">{habit.emoji}</span>
          <div>
            <h3 className="font-semibold">{habit.name}</h3>
            {habit.goal && (
              <p className="text-xs text-slate-400">🎯 {habit.goal}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {habit.streak > 0 && (
            <div className="flex items-center gap-1 bg-orange-500/20 px-2 py-1 rounded-md">
              <span className="text-sm font-bold text-orange-300">🔥 {habit.streak}</span>
            </div>
          )}

          <button
            onClick={onToggle}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all font-bold text-lg ${
              habit.completed
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
            }`}
          >
            {habit.completed ? '✓' : '○'}
          </button>
        </div>
      </div>
    </div>
  )
}
