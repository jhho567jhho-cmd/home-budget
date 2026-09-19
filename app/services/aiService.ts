// שכבת Service ל-AI
// בהמשך תחובר ל-OpenAI API
// כרגע משתמש ב-Mock responses

import { Client, Meeting, Task } from '@/app/types'

export interface AIMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface AIContext {
  clients?: Client[]
  meetings?: Meeting[]
  tasks?: Task[]
  userEmail?: string
}

// Mock responses - בהמשך יוחלף ב-OpenAI API
const getMockResponse = (
  message: string,
  context?: AIContext
): string => {
  const lowerMessage = message.toLowerCase()

  // פעולות מהירות
  if (
    lowerMessage.includes('יש לי היום') ||
    lowerMessage.includes('מה היום')
  ) {
    const meetings = context?.meetings || []
    const tasks = context?.tasks || []
    const today = new Date().toISOString().split('T')[0]

    const todayMeetings = meetings.filter((m) => m.date === today)
    const todayTasks = tasks.filter((t) => t.dueDate === today)

    return `היום יש לך:
• ${todayMeetings.length} פגישות
• ${todayTasks.length} משימות

${
  todayMeetings.length > 0
    ? `פגישות:\n${todayMeetings.map((m) => `  - ${m.time}: ${m.summary.mainTopic}`).join('\n')}\n`
    : ''
}
${
  todayTasks.length > 0
    ? `משימות:\n${todayTasks.map((t) => `  - ${t.title}`).join('\n')}`
    : ''
}`
  }

  if (lowerMessage.includes('לקוחות דורשים')) {
    const followupClients = (context?.clients || []).filter(
      (c) => c.status === 'followup'
    )
    if (followupClients.length === 0) {
      return 'אין לקוחות שדורשים מעקב כרגע. כל הלקוחות שלך בסדר! 🎉'
    }
    return `${followupClients.length} לקוחות דורשים מעקב:\n${followupClients
      .map((c) => `• ${c.name}`)
      .join('\n')}`
  }

  if (lowerMessage.includes('סכם') && lowerMessage.includes('פגישות')) {
    const meetings = context?.meetings || []
    const today = new Date().toISOString().split('T')[0]
    const todayMeetings = meetings.filter((m) => m.date === today)

    if (todayMeetings.length === 0) {
      return 'אין פגישות היום. יום שקט! 😊'
    }

    const summary = todayMeetings
      .map(
        (m) =>
          `${m.time}: ${m.summary.mainTopic}\n` +
          `   מטרות: ${m.summary.goals.join(', ') || 'לא הוגדרו'}`
      )
      .join('\n\n')

    return `סיכום הפגישות של היום:\n\n${summary}`
  }

  if (
    lowerMessage.includes('משימות') &&
    lowerMessage.includes('פתוח')
  ) {
    const openTasks = (context?.tasks || []).filter(
      (t) => t.status !== 'completed'
    )
    if (openTasks.length === 0) {
      return 'אין משימות פתוחות! אתה בסדר גמור! ✅'
    }
    return `יש לך ${openTasks.length} משימות פתוחות:\n${openTasks
      .map((t) => `• ${t.title} (${t.priority === 'high' ? '🔴' : '🟢'})`)
      .join('\n')}`
  }

  if (lowerMessage.includes('לקוחות') && lowerMessage.includes('ללא')) {
    const newClients = (context?.clients || []).filter(
      (c) => c.status === 'new'
    )
    if (newClients.length === 0) {
      return 'אין לקוחות חדשים. כל הלקוחות שלך כבר בתכנית! 🎯'
    }
    return `${newClients.length} לקוחות חדשים:\n${newClients
      .map((c) => `• ${c.name}`)
      .join('\n')}`
  }

  // Default response
  return `בהודעה: "${message}"\n\n✨ זו עדיין תשובה mock.\nבקרוב אני אחובר ל-AI אמיתי ואוכל לסייע בצורה עדיפה!`
}

export const aiService = {
  /**
   * שלח הודעה ל-AI וקבל תגובה
   * בהמשך זה יהיה API call ל-OpenAI
   */
  async sendMessage(
    message: string,
    context?: AIContext
  ): Promise<AIMessage> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const response = getMockResponse(message, context)

    return {
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString(),
    }
  },

  /**
   * בדוק אם הודעה היא פעולה מהירה
   */
  isQuickAction(message: string): boolean {
    const quickActions = [
      'יש לי היום',
      'מה היום',
      'לקוחות דורשים',
      'סכם',
      'משימות',
      'לקוחות ללא',
    ]
    return quickActions.some((action) =>
      message.toLowerCase().includes(action)
    )
  },
}
