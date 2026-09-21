import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY,
})

export interface AIServiceContext {
  userName: string
  currentHabits?: {
    name: string
    completed: boolean
    streak: number
  }[]
  upcomingMeals?: {
    name: string
    time: string
  }[]
  todayStats?: {
    completionPercentage: number
    mealsLogged: number
    habitsCompleted: number
  }
}

export async function sendMessageToAI(
  userMessage: string,
  context: AIServiceContext,
  conversationHistory: Array<{ role: string; content: string }>
): Promise<string> {
  try {
    // בנה prompt עם context
    const systemPrompt = `אתה עוזר אישי לניהול בריאות וארוחות בשם LifeBalance Coach.
המשתמש: ${context.userName}

מידע נוכחי:
- התקדמות היום: ${context.todayStats?.completionPercentage || 0}%
- ארוחות שנרשמו: ${context.todayStats?.mealsLogged || 0}
- הרגלים שהושלמו: ${context.todayStats?.habitsCompleted || 0}

הרגלים של היום:
${context.currentHabits?.map(h => `- ${h.name}: ${h.completed ? '✅ הושלם' : '❌ בהמתנה'} (סטריק: ${h.streak} ימים)`).join('\n') || 'אין הרגלים'}

ארוחות קרובות:
${context.upcomingMeals?.map(m => `- ${m.name} ב-${m.time}`).join('\n') || 'אין ארוחות תוכננו'}

הנחיות:
1. תמיד תשיב בעברית
2. תן תשובות קצרות וישירות (עד 3 משפטים בדרך כלל)
3. תהי מעודד וחיובי
4. תן הצעות מותאמות בהתאם לנתונים של המשתמש
5. בדוק אם המשתמש צריך עזרה בהרגלים או ארוחות
6. תן טיפים מעשיים וקלים לביצוע`

    // המר history ל-format של Anthropic
    const messages = conversationHistory.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    }))

    // הוסף ההודעה החדשה
    messages.push({
      role: 'user' as const,
      content: userMessage
    })

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 300,
      system: systemPrompt,
      messages: messages
    })

    // חלץ את התשובה
    const assistantMessage = response.content[0]
    if (assistantMessage.type === 'text') {
      return assistantMessage.text
    }

    return 'סליחה, קרתה שגיאה בעיבוד. אנא נסה שוב.'
  } catch (error) {
    console.error('שגיאה בשיחה עם AI:', error)
    return 'סליחה, קרתה שגיאה בחיבור ל-AI. אנא ודא שה-API key מוגדר בנכון.'
  }
}

// בדיקה אם API key קיים
export function hasAPIKey(): boolean {
  return !!(process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY)
}

// תשובה fallback אם אין API key
export function getFallbackResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase()

  if (lowerMessage.includes('ארוחה') || lowerMessage.includes('אכול')) {
    return '🍽️ הצעה: בחר ארוחה בריאה כמו סלט או דגים. זה יעזור לך להגיע לרצף חזק! 💪'
  }
  if (lowerMessage.includes('הרגל')) {
    return '🔥 הסטריק שלך חשוב! כל יום שאתה מושלם הרגל = נקודה חדשה בקשת ההצלחה שלך!'
  }
  if (lowerMessage.includes('איך') || lowerMessage.includes('טיפ')) {
    return '💡 טיפ היום: התחל בדבר קטן. בחר הרגל אחד וקדם אותו. הצלחה קטנה = קדימה גדולה!'
  }

  return '👋 שלום! אני כאן לעזור לך להצליח. שאל אותי משהו על הרגלים, ארוחות או התקדמות שלך!'
}
