import { NextRequest, NextResponse } from 'next/server'
import { extractExpenseData, generateResponse } from '@/app/utils/nlp'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message' },
        { status: 400 }
      )
    }

    // Extract expense data using NLP
    const expenseData = extractExpenseData(message)

    // Generate response
    const response = generateResponse(expenseData)

    return NextResponse.json({
      success: true,
      response,
      expenseData: {
        amount: expenseData.amount,
        category: expenseData.category,
        confidence: expenseData.confidence,
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
