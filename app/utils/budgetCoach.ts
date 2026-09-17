// AI Budget Coach - Smart financial advisor

interface ExpenseWithDate {
  amount: number
  category: string
  description: string
  timestamp: Date
}

interface CoachAdvice {
  title: string
  advice: string
  emoji: string
  priority: 'high' | 'medium' | 'low'
  actionable: boolean
  potentialSavings?: number
}

// Analyze spending patterns and give personalized advice
export function generateBudgetAdvice(expenses: ExpenseWithDate[]): CoachAdvice[] {
  const advice: CoachAdvice[] = []

  if (expenses.length === 0) {
    return [
      {
        title: 'התחל לעקוב אחרי הוצאות',
        advice: 'התחל להוסיף הוצאות כדי לקבל ניתוח מפורט של ההוצאות שלך',
        emoji: '📝',
        priority: 'high',
        actionable: false,
      },
    ]
  }

  // Calculate spending metrics
  const categoryTotals = new Map<string, number>()
  const dailyTotals = new Map<string, number>()

  expenses.forEach((e) => {
    const category = e.category
    const date = e.timestamp.toISOString().split('T')[0]

    categoryTotals.set(category, (categoryTotals.get(category) || 0) + e.amount)
    dailyTotals.set(date, (dailyTotals.get(date) || 0) + e.amount)
  })

  const totalSpending = Array.from(categoryTotals.values()).reduce((a, b) => a + b, 0)
  const avgDaily = totalSpending / Math.max(dailyTotals.size, 1)
  const maxDaily = Math.max(...Array.from(dailyTotals.values()), 1)

  // 1. Spending spike detection
  if (maxDaily > avgDaily * 1.5) {
    advice.push({
      title: 'זיהוי בהוצאות גבוהות',
      advice: `בימים מסוימים אתה מוציא יותר מ-50% מממוצע. זה יכול להיות טוב לתכנן בעבור ימים אלה.`,
      emoji: '📈',
      priority: 'medium',
      actionable: true,
    })
  }

  // 2. Category imbalance
  const categoryPercentages = Array.from(categoryTotals.entries())
    .map(([cat, total]) => ({ category: cat, percentage: (total / totalSpending) * 100 }))
    .sort((a, b) => b.percentage - a.percentage)

  if (categoryPercentages[0].percentage > 40) {
    advice.push({
      title: 'קטגוריה דומיננטית',
      advice: `${categoryPercentages[0].category} מהווה ${categoryPercentages[0].percentage.toFixed(0)}% מהוצאותיך. שקול להפחית או להגבול קטגוריה זו.`,
      emoji: '⚠️',
      priority: 'high',
      actionable: true,
      potentialSavings: Math.round((categoryTotals.get(categoryPercentages[0].category) || 0) * 0.15),
    })
  }

  // 3. Consistency check
  const categoryVariance = Array.from(categoryTotals.entries()).map(([cat, total]) => {
    const categoryExpenses = expenses.filter((e) => e.category === cat).map((e) => e.amount)
    const avg = total / categoryExpenses.length
    const variance = categoryExpenses.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / categoryExpenses.length

    return { category: cat, variance: Math.sqrt(variance), avg }
  })

  const inconsistentCategories = categoryVariance.filter((c) => c.variance > c.avg * 0.5)

  if (inconsistentCategories.length > 0) {
    advice.push({
      title: 'הוצאות שונות בקטגוריות',
      advice: `בקטגוריות ${inconsistentCategories.map((c) => c.category).join(', ')} יש שונות גבוהה בהוצאות. נסו להיות עקביים יותר.`,
      emoji: '📊',
      priority: 'low',
      actionable: true,
    })
  }

  // 4. Frequency analysis
  const recurringCandidates = Array.from(categoryTotals.entries())
    .filter(([_, total]) => total > totalSpending * 0.15)
    .map(([cat]) => cat)

  if (recurringCandidates.length > 0) {
    advice.push({
      title: 'בדוק הוצאות חוזרות',
      advice: `בקטגוריות ${recurringCandidates.join(', ')} יכול להיות פוטנציאל לחיסכון עם תכניות או הנחות קבועות.`,
      emoji: '🔄',
      priority: 'medium',
      actionable: true,
    })
  }

  // 5. Milestone celebration
  if (expenses.length === 10) {
    advice.push({
      title: 'ברכות! 10 הוצאות רשומות',
      advice: 'אתה בדרך הנכונה! המשך להוסיף הוצאות כדי לקבל ניתוח עדיף יותר של ההרגלים הכספיים שלך.',
      emoji: '🎉',
      priority: 'low',
      actionable: false,
    })
  }

  if (expenses.length === 50) {
    advice.push({
      title: 'מעלה! 50 הוצאות',
      advice: 'יש לך מקור נתונים עשיר! כעת תוכל לראות דפוסים ממשיים בהוצאותיך.',
      emoji: '🏆',
      priority: 'low',
      actionable: false,
    })
  }

  // 6. Smart spending tips based on time
  const now = new Date()
  const isWeekend = now.getDay() === 0 || now.getDay() === 6
  const isMonthEnd = now.getDate() > 25

  if (isMonthEnd && avgDaily > 100) {
    advice.push({
      title: 'סוף החודש קרב',
      advice: 'אתה בקרוב לסוף החודש. הגן על תקציב שלך וחשוב על הוצאות חיוניות בלבד.',
      emoji: '📅',
      priority: 'high',
      actionable: true,
    })
  }

  if (isWeekend) {
    const weekendExpenses = expenses.filter(
      (e) => new Date(e.timestamp).getDay() === 0 || new Date(e.timestamp).getDay() === 6
    )
    const weekdayExpenses = expenses.filter(
      (e) => new Date(e.timestamp).getDay() !== 0 && new Date(e.timestamp).getDay() !== 6
    )

    if (weekendExpenses.length > 0 && weekdayExpenses.length > 0) {
      const avgWeekend = weekendExpenses.reduce((s, e) => s + e.amount, 0) / weekendExpenses.length
      const avgWeekday = weekdayExpenses.reduce((s, e) => s + e.amount, 0) / weekdayExpenses.length

      if (avgWeekend > avgWeekday * 1.3) {
        advice.push({
          title: 'השוואת הוצאות סוף שבוע',
          advice: `הוצאות שלך בסוף שבוע גבוהות ב-${Math.round(((avgWeekend / avgWeekday - 1) * 100))}% מימי השבוע.`,
          emoji: '📉',
          priority: 'medium',
          actionable: true,
          potentialSavings: Math.round((avgWeekend - avgWeekday) * 4),
        })
      }
    }
  }

  return advice
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
    .slice(0, 5) // Return top 5 advices
}

// Generate motivational message based on spending
export function getMotivationalMessage(expenses: ExpenseWithDate[]): string {
  if (expenses.length === 0) return '🌟 בואו נתחיל! הוסף את ההוצאה הראשונה שלך'

  const totalSpending = expenses.reduce((sum, e) => sum + e.amount, 0)
  const avgExpense = totalSpending / expenses.length

  if (avgExpense < 50) {
    return '💪 הוצאות שלך נמוכות מאד! הישאר בדרך הנכונה'
  }

  if (avgExpense < 100) {
    return '👍 הוצאות בממוצע טוב! המשך להשגיח'
  }

  if (avgExpense < 200) {
    return '⚡ הוצאות בשליטה, אך שים לב להוצאות גדולות'
  }

  return '⚠️ הוצאות כבדות. שקול להוריד או להגביל הוצאות מסוימות'
}

// Score your spending health
export interface SpendingScore {
  score: number // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  status: string
  tips: string[]
}

export function calculateSpendingScore(expenses: ExpenseWithDate[]): SpendingScore {
  let score = 100

  if (expenses.length === 0) {
    return {
      score: 0,
      grade: 'F',
      status: 'אין נתונים עדיין',
      tips: ['התחל להוסיף הוצאות לניתוח'],
    }
  }

  // Consistency check
  const categoryTotals = new Map<string, number>()
  expenses.forEach((e) => {
    categoryTotals.set(e.category, (categoryTotals.get(e.category) || 0) + e.amount)
  })

  const totalSpending = Array.from(categoryTotals.values()).reduce((a, b) => a + b, 0)
  const avgExpense = totalSpending / expenses.length

  // Deduct for high spending
  if (avgExpense > 500) score -= 20
  else if (avgExpense > 300) score -= 10
  else if (avgExpense > 150) score -= 5

  // Deduct for imbalance
  const maxCategory = Math.max(...Array.from(categoryTotals.values()))
  if (maxCategory > totalSpending * 0.5) score -= 15

  // Bonus for tracking
  if (expenses.length > 50) score += 10
  if (expenses.length > 100) score += 10

  score = Math.max(0, Math.min(100, score))

  let grade: 'A' | 'B' | 'C' | 'D' | 'F'
  if (score >= 90) grade = 'A'
  else if (score >= 80) grade = 'B'
  else if (score >= 70) grade = 'C'
  else if (score >= 60) grade = 'D'
  else grade = 'F'

  const statusMap = {
    A: 'מדהים! הוצאות בשליטה מלאה',
    B: 'טוב! עם קצת השגחה יותר',
    C: 'סביר. יש מקום לשיפור',
    D: 'דורש תשומת לב. שנה הרגלים',
    F: 'קריטי. בואו נעבוד על זה',
  }

  const tipsMap = {
    A: [
      '✨ אתה בדרך הנכונה! המשך כך',
      '💎 רמה גבוהה של משמעת כלכלית',
    ],
    B: [
      '🎯 שים לב להוצאות גדולות',
      '📊 בדוק דפוסים חוזרים',
    ],
    C: [
      '⚠️ הפחת הוצאות מסוימות',
      '🔍 נתח את הוצאותיך בעיון',
    ],
    D: [
      '🚨 קבע תקציב יעדים',
      '💪 שנה הרגלי הוצאה',
    ],
    F: [
      '🆘 חיתוך דחוף נדרש',
      '📋 צור תכנית הוצאה',
    ],
  }

  return {
    score,
    grade,
    status: statusMap[grade],
    tips: tipsMap[grade],
  }
}
