// Advanced NLP with ML-like features

interface ExpensePattern {
  keywords: string[]
  category: string
  weight: number
}

// Advanced pattern matching
const advancedPatterns: ExpensePattern[] = [
  {
    keywords: ['לחם', 'חלב', 'ביצים', 'פרוטאין', 'סופר', 'מכולת'],
    category: 'קניות',
    weight: 1.0,
  },
  {
    keywords: ['סרט', 'קולנוע', 'כרטיס', 'בלט', 'קונצרט'],
    category: 'בידור',
    weight: 1.0,
  },
  {
    keywords: ['כושר', 'ג\'ימ', 'יוגה', 'מאמן', 'ספורט'],
    category: 'ספורט',
    weight: 1.0,
  },
  {
    keywords: ['רופא', 'בית חולים', 'תרופה', 'אקסריי', 'בדיקה'],
    category: 'בריאות',
    weight: 1.0,
  },
  {
    keywords: ['הזמנה', 'מסעדה', 'פיצה', 'בורגר', 'אוכל'],
    category: 'בידור',
    weight: 0.9,
  },
];

// Recurring pattern detection
export interface RecurringExpense {
  pattern: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  averageAmount: number
  category: string
  confidence: number
}

// Analyze for recurring patterns
export function detectRecurringPatterns(
  expenses: Array<{ description: string; amount: number; category: string; date: Date }>
): RecurringExpense[] {
  const patterns: Map<string, Array<{ amount: number; date: Date }>> = new Map()

  // Group by normalized description
  expenses.forEach((exp) => {
    const normalized = exp.description
      .split(' ')
      .filter((w) => w.length > 2)
      .join(' ')
      .toLowerCase()

    if (!patterns.has(normalized)) {
      patterns.set(normalized, [])
    }
    patterns.get(normalized)!.push({ amount: exp.amount, date: exp.date })
  })

  const recurring: RecurringExpense[] = []

  patterns.forEach((occurrences, pattern) => {
    if (occurrences.length >= 2) {
      const dates = occurrences.map((o) => o.date.getTime()).sort((a, b) => a - b)
      const intervals = []

      for (let i = 1; i < dates.length; i++) {
        intervals.push(dates[i] - dates[i - 1])
      }

      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
      const daysDiff = avgInterval / (1000 * 60 * 60 * 24)

      let frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'yearly'
      let confidence = 0.5

      if (daysDiff < 2) {
        frequency = 'daily'
        confidence = 0.9
      } else if (daysDiff < 10) {
        frequency = 'weekly'
        confidence = 0.85
      } else if (daysDiff < 45) {
        frequency = 'monthly'
        confidence = 0.8
      }

      recurring.push({
        pattern,
        frequency,
        averageAmount: occurrences.reduce((a, b) => a + b.amount, 0) / occurrences.length,
        category: expenses.find((e) => e.description.toLowerCase() === pattern)?.category || 'אחר',
        confidence,
      })
    }
  })

  return recurring.sort((a, b) => b.confidence - a.confidence)
}

// Smart savings suggestions
export interface SavingsSuggestion {
  title: string
  description: string
  monthlyPotential: number
  category: string
  priority: 'high' | 'medium' | 'low'
}

export function generateSavingsSuggestions(
  expenses: Array<{ category: string; amount: number }>
): SavingsSuggestion[] {
  const suggestions: SavingsSuggestion[] = []
  const categoryTotals = new Map<string, number>()

  expenses.forEach((exp) => {
    categoryTotals.set(exp.category, (categoryTotals.get(exp.category) || 0) + exp.amount)
  })

  // Analyze each category for savings opportunities
  categoryTotals.forEach((total, category) => {
    if (category === 'בידור' && total > 500) {
      suggestions.push({
        title: 'הפחת הוצאות בידור',
        description: 'נראה שמוציא הרבה על בידור. ספור שתף בעלויות או חיסכון בכרטיסים',
        monthlyPotential: Math.round(total * 0.2),
        category: 'בידור',
        priority: 'high',
      })
    }

    if (category === 'קניות' && total > 800) {
      suggestions.push({
        title: 'קניות בחו״ח קונקורנטיים',
        description: 'השווה מחירים בין סופרים וקנה בחנויות זולות יותר',
        monthlyPotential: Math.round(total * 0.15),
        category: 'קניות',
        priority: 'high',
      })
    }

    if (category === 'ספורט' && total > 300) {
      suggestions.push({
        title: 'חנויות ספורט זולות',
        description: 'חפש קופונים ודיילים בחנויות ספורט ותרגול בבית',
        monthlyPotential: Math.round(total * 0.25),
        category: 'ספורט',
        priority: 'medium',
      })
    }
  })

  return suggestions.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
}

// Budget alert system
export interface BudgetAlert {
  message: string
  type: 'warning' | 'danger' | 'info'
  category: string
  percentage: number
}

export function checkBudgetAlerts(
  spent: number,
  budget: number,
  category: string
): BudgetAlert | null {
  const percentage = (spent / budget) * 100

  if (percentage >= 90) {
    return {
      message: `⚠️ אתה בסכנה! השתמשת ב-${percentage.toFixed(0)}% מהתקציב בקטגוריית ${category}`,
      type: 'danger',
      category,
      percentage,
    }
  } else if (percentage >= 75) {
    return {
      message: `⚡ זהירות! השתמשת ב-${percentage.toFixed(0)}% מהתקציב בקטגוריית ${category}`,
      type: 'warning',
      category,
      percentage,
    }
  }

  return null
}

// Sentiment-based messages
export function generateContextualMessage(
  amount: number,
  category: string,
  sentiment: 'happy' | 'neutral' | 'concerned'
): string {
  const messages: Record<string, Record<string, string[]>> = {
    happy: {
      קניות: ['🎉 קניה מוצלחת!', '😊 נראה שיש לך טוב!', '🛍️ ממלא את הלב!'],
      ספורט: ['💪 תמשיך כך!', '🏋️ השקעה בבריאות!', '⚽ כל הכבוד!'],
      בידור: ['🎬 תהנה!', '🎉 בידור שווה!', '🍕 מחרוזת טוב!'],
    },
    neutral: {
      קניות: ['✓ הוספתי לרשימה', '📝 רשמתי הוצאה', '💰 עדכנתי את התקציב'],
      ספורט: ['✓ ספורט רשום', '💪 עדכון כושר', '⚽ רשום'],
    },
    concerned: {
      קניות: ['⚠️ יקר קצת', '💭 בחשבון שיש תקציב', '💸 קצת הרבה'],
      ספורט: ['⚠️ יקר ספורט', '💭 כדאי לחשוב על זה', '💸 עלות גבוהה'],
    },
  }

  const sentimentMessages = messages[sentiment]?.[category] || ['✓ רשמתי']
  return sentimentMessages[Math.floor(Math.random() * sentimentMessages.length)]
}

// Month prediction
export function predictMonthlySpending(
  expenses: Array<{ amount: number; date: Date }>
): number {
  if (expenses.length === 0) return 0

  const now = new Date()
  const currentMonth = expenses.filter(
    (e) => e.date.getMonth() === now.getMonth() && e.date.getFullYear() === now.getFullYear()
  )

  if (currentMonth.length === 0) return 0

  const daysPassed = now.getDate()
  const monthTotal = currentMonth.reduce((sum, e) => sum + e.amount, 0)

  return Math.round((monthTotal / daysPassed) * 30)
}
