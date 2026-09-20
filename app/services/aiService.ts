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

export const aiService = {
  /**
   * שלח הודעה ל-AI וקבל תגובה בעזרת Claude API
   */
  async sendMessage(
    message: string,
    context?: AIContext
  ): Promise<AIMessage> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('AI Service Error:', error)
      throw error
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
