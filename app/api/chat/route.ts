import { Anthropic } from '@anthropic-ai/sdk'
import { Client, Meeting, Task } from '@/app/types'

interface ChatRequest {
  message: string
  context?: {
    clients?: Client[]
    meetings?: Meeting[]
    tasks?: Task[]
  }
}

const MEETING_TYPE_LABELS: Record<string, string> = {
  session: '🎯 הפגשה',
  assessment: '📊 הערכה',
  followup: '🔄 מעקב',
  consultation: '💼 ייעוץ',
}

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

// עוזרת חוקים חינמית - עונה מהנתונים האמיתיים של המשתמש, בלי לקרוא ל-AI בתשלום
function ruleBasedReply(message: string, context: ChatRequest['context']): string {
  const meetings = context?.meetings || []
  const tasks = context?.tasks || []
  const clients = context?.clients || []
  const today = todayStr()
  const m = message.trim()

  const todayMeetings = meetings.filter((mtg) => mtg.date === today)
  const todayTasks = tasks.filter((t) => t.dueDate === today && t.status !== 'completed')
  const followupClients = clients.filter((c) => c.status === 'followup')
  const newClients = clients.filter((c) => c.status === 'new')
  const openTasks = tasks.filter((t) => t.status !== 'completed')

  if (m.includes('יש לי היום') || m.includes('מה היום')) {
    if (todayMeetings.length === 0 && todayTasks.length === 0) {
      return 'אין לך פגישות או משימות פתוחות להיום. יום פנוי! 🎉'
    }
    const lines: string[] = []
    if (todayMeetings.length > 0) {
      lines.push(`📋 יש לך ${todayMeetings.length} פגישות היום:`)
      todayMeetings.forEach((mtg) => {
        const client = clients.find((c) => c.id === mtg.clientId)
        lines.push(`• ${mtg.time} - ${client?.name || 'לקוח'} (${MEETING_TYPE_LABELS[mtg.type] || mtg.type})`)
      })
    }
    if (todayTasks.length > 0) {
      lines.push(`\n✓ יש לך ${todayTasks.length} משימות להיום:`)
      todayTasks.forEach((t) => lines.push(`• ${t.title}`))
    }
    return lines.join('\n')
  }

  if (m.includes('לקוחות דורשים') || m.includes('דורש מעקב')) {
    if (followupClients.length === 0) {
      return 'אין כרגע לקוחות שדורשים מעקב. הכל בשליטה! ✅'
    }
    return `⚠️ ${followupClients.length} לקוחות דורשים מעקב:\n${followupClients.map((c) => `• ${c.name}`).join('\n')}`
  }

  if (m.includes('סכם') && m.includes('פגיש')) {
    if (todayMeetings.length === 0) {
      return 'אין פגישות היום לסכם.'
    }
    return todayMeetings
      .map((mtg) => {
        const client = clients.find((c) => c.id === mtg.clientId)
        return `📌 ${mtg.time} - ${client?.name || 'לקוח'}\nנושא: ${mtg.summary?.mainTopic || 'לא צוין'}`
      })
      .join('\n\n')
  }

  if (m.includes('משימות פתוחות') || m.includes('משימות')) {
    if (openTasks.length === 0) {
      return 'אין משימות פתוחות כרגע. כל הכבוד! ✓'
    }
    return `✓ ${openTasks.length} משימות פתוחות:\n${openTasks.map((t) => `• ${t.title} (עד ${t.dueDate})`).join('\n')}`
  }

  if (m.includes('לקוחות ללא') || m.includes('לקוחות חדשים')) {
    if (newClients.length === 0) {
      return 'אין כרגע לקוחות חדשים ללא מעקב.'
    }
    return `👤 ${newClients.length} לקוחות חדשים:\n${newClients.map((c) => `• ${c.name}`).join('\n')}`
  }

  return 'אני עוזרת פשוטה שעונה על פי הנתונים שלך - נסי את אחד הכפתורים המהירים למעלה 👆, או שאלי "מה יש לי היום?", "אילו לקוחות דורשים מעקב?" או "הצג משימות פתוחות".\n\n(לעוזרת AI חכמה שמבינה כל שאלה, אפשר לשדרג בהמשך)'
}

export async function POST(request: Request) {
  try {
    const { message, context }: ChatRequest = await request.json()

    if (!message || !message.trim()) {
      return Response.json({ error: 'Message is required' }, { status: 400 })
    }

    // בלי מפתח API - נענה עם עוזרת חוקים חינמית מהנתונים האמיתיים
    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json({
        role: 'assistant',
        content: ruleBasedReply(message, context),
        timestamp: new Date().toISOString(),
      })
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    let systemPrompt = `אתה עוזר אישי חכם לניהול תקציב ביתי בעברית.
עזור לדברה לנהל את הכנסותיה, הוצאותיה, פגישותיה וקשרי הלקוחות שלה.
תמיד השב בעברית בתשובות קצרות וברורות.
בתשובות זכור להציג מידע בעמודות כאשר זה רלוונטי.`

    if (context?.meetings || context?.clients || context?.tasks) {
      const today = todayStr()
      const todayMeetings = context.meetings?.filter((m) => m.date === today) || []
      const todayTasks = context.tasks?.filter((t) => t.dueDate === today) || []
      const followupClients = context.clients?.filter((c) => c.status === 'followup') || []
      const newClients = context.clients?.filter((c) => c.status === 'new') || []

      systemPrompt += `\n\nנתונים עדכניים:
פגישות היום: ${todayMeetings.length}
משימות היום: ${todayTasks.length}
לקוחות דורשים מעקב: ${followupClients.length}
לקוחות חדשים: ${newClients.length}`
    }

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      system: systemPrompt,
      messages: [{ role: 'user', content: message }],
    })

    const aiMessage = response.content[0]
    if (aiMessage.type !== 'text') {
      return Response.json({ error: 'Unexpected response type' }, { status: 500 })
    }

    return Response.json({
      role: 'assistant',
      content: aiMessage.text,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('AI Service Error:', error)
    return Response.json({ error: 'Failed to get AI response' }, { status: 500 })
  }
}
