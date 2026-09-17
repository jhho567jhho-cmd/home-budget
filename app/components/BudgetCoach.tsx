'use client'

import { useMemo } from 'react'
import { generateBudgetAdvice, getMotivationalMessage, calculateSpendingScore } from '@/app/utils/budgetCoach'

interface BudgetCoachProps {
  expenses: Array<{
    id: number
    amount: number
    category: string
    description: string
    timestamp: Date
  }>
}

export function BudgetCoach({ expenses }: BudgetCoachProps) {
  const advice = useMemo(
    () =>
      generateBudgetAdvice(
        expenses.map((e) => ({
          amount: e.amount,
          category: e.category,
          description: e.description,
          timestamp: e.timestamp,
        }))
      ),
    [expenses]
  )

  const motivation = useMemo(() => getMotivationalMessage(expenses.map((e) => ({
    amount: e.amount,
    category: e.category,
    description: e.description,
    timestamp: e.timestamp,
  }))), [expenses])

  const score = useMemo(() => calculateSpendingScore(expenses.map((e) => ({
    amount: e.amount,
    category: e.category,
    description: e.description,
    timestamp: e.timestamp,
  }))), [expenses])

  const gradeColors = {
    A: 'text-green-400 bg-green-900/30',
    B: 'text-blue-400 bg-blue-900/30',
    C: 'text-yellow-400 bg-yellow-900/30',
    D: 'text-orange-400 bg-orange-900/30',
    F: 'text-red-400 bg-red-900/30',
  }

  return (
    <div className="space-y-4">
      {/* Motivational Message */}
      <div className="bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border border-purple-500/50 rounded-lg p-4">
        <p className="text-center text-sm font-semibold text-purple-300">{motivation}</p>
      </div>

      {/* Spending Score */}
      <div className="space-y-2">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-gray-200">📈 ניקוד הוצאות</h3>
          <div className={`text-2xl font-bold w-12 h-12 rounded-lg flex items-center justify-center ${gradeColors[score.grade]}`}>
            {score.grade}
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300">ניקוד</span>
              <span className="font-semibold">{score.score}/100</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-red-500 transition-all duration-500"
                style={{ width: `${score.score}%` }}
              />
            </div>
          </div>

          <p className="text-sm text-gray-300 mb-3">{score.status}</p>

          <div className="space-y-1">
            {score.tips.map((tip, idx) => (
              <p key={idx} className="text-xs text-gray-400">
                {tip}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Coach Advice */}
      {advice.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-200 mb-2">💡 עצות מעוזר התקציב</h3>
          <div className="space-y-2">
            {advice.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border-l-4 ${
                  item.priority === 'high'
                    ? 'border-l-red-500 bg-red-900/20 border border-red-500/30'
                    : item.priority === 'medium'
                      ? 'border-l-yellow-500 bg-yellow-900/20 border border-yellow-500/30'
                      : 'border-l-blue-500 bg-blue-900/20 border border-blue-500/30'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-200">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{item.advice}</p>
                    {item.potentialSavings && (
                      <p className="text-xs text-green-400 mt-2 font-semibold">
                        💰 חיסכון פוטנציאלי: ₪{item.potentialSavings}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
