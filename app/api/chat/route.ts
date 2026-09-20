import { Anthropic } from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

interface ChatRequest {
  message: string
  context?: {
    clients?: any[]
    meetings?: any[]
    tasks?: any[]
  }
}

export async function POST(request: Request) {
  try {
    const { message, context }: ChatRequest = await request.json()

    if (!message || !message.trim()) {
      return Response.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // ניתוח הודעה לפעולות מהירות
    const lowerMessage = message.toLowerCase()
    let systemPrompt = `אתה עוזר אישי חכם לניהול תקציב ביתי בעברית.
עזור לדברה לנהל את הכנסותיה, הוצאותיה, פגישותיה וקשרי הלקוחות שלה.
תמיד השב בעברית בתשובות קצרות וברורות.
בתשובות זכור להציג מידע בעמודות כאשר זה רלוונטי.`

    // אם זו בקשה מהירה, הוסף קונטקסט רלוונטי
    if (context?.meetings || context?.clients || context?.tasks) {
      const today = new Date().toISOString().split('T')[0]
      const todayMeetings = context.meetings?.filter((m: any) => m.date === today) || []
      const todayTasks = context.tasks?.filter((t: any) => t.dueDate === today) || []
      const followupClients = context.clients?.filter((c: any) => c.status === 'followup') || []
      const newClients = context.clients?.filter((c: any) => c.status === 'new') || []

      systemPrompt += `\n\nנתונים עדכניים:
פגישות היום: ${todayMeetings.length}
משימות היום: ${todayTasks.length}
לקוחות דורשים מעקב: ${followupClients.length}
לקוחות חדשים: ${newClients.length}`
    }

    const response = await anthropic.messages.create({
      model: 'claude-opus-4-1',
      max_tokens: 500,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    })

    const aiMessage = response.content[0]
    if (aiMessage.type !== 'text') {
      return Response.json(
        { error: 'Unexpected response type' },
        { status: 500 }
      )
    }

    return Response.json({
      role: 'assistant',
      content: aiMessage.text,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('AI Service Error:', error)
    return Response.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    )
  }
}
