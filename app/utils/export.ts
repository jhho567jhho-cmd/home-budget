// Export and import utilities

export interface ExportData {
  version: string
  exportDate: string
  expenses: Array<{
    id: number
    amount: number
    category: string
    description: string
    timestamp: string
  }>
  metadata: {
    totalExpenses: number
    totalAmount: number
    categories: string[]
  }
}

export function exportExpensesAsJSON(expenses: any[]): string {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0)
  const categories = [...new Set(expenses.map((e) => e.category))]

  const data: ExportData = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    expenses: expenses.map((e) => ({
      id: e.id,
      amount: e.amount,
      category: e.category,
      description: e.description,
      timestamp: e.timestamp.toISOString(),
    })),
    metadata: {
      totalExpenses: expenses.length,
      totalAmount: total,
      categories,
    },
  }

  return JSON.stringify(data, null, 2)
}

export function exportExpensesAsCSV(expenses: any[]): string {
  const headers = ['תאריך', 'קטגוריה', 'תיאור', 'סכום (₪)']
  const rows = expenses.map((e) => [
    e.timestamp.toLocaleDateString('he-IL'),
    e.category,
    `"${e.description}"`,
    e.amount.toFixed(2),
  ])

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')

  return csv
}

export function downloadFile(content: string, filename: string, type: 'json' | 'csv') {
  const mimeType = type === 'json' ? 'application/json' : 'text/csv;charset=utf-8;'
  const blob = new Blob([content], { type: mimeType })
  const link = document.createElement('a')

  link.href = URL.createObjectURL(blob)
  link.download = `${filename}.${type}`
  link.click()

  URL.revokeObjectURL(link.href)
}

export function importExpensesFromJSON(jsonContent: string): any[] {
  try {
    const data: ExportData = JSON.parse(jsonContent)

    if (!data.expenses || !Array.isArray(data.expenses)) {
      throw new Error('Invalid JSON format')
    }

    return data.expenses.map((e) => ({
      id: e.id,
      amount: e.amount,
      category: e.category,
      description: e.description,
      timestamp: new Date(e.timestamp),
    }))
  } catch (error) {
    console.error('Failed to import JSON:', error)
    throw new Error('Failed to parse JSON file')
  }
}

export function generateReport(expenses: any[]): string {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0)
  const categories = new Map<string, number>()

  expenses.forEach((e) => {
    categories.set(e.category, (categories.get(e.category) || 0) + e.amount)
  })

  let report = `
═══════════════════════════════════════════
            דוח הוצאות Budget Buddy
═══════════════════════════════════════════

📅 תאריך הדוח: ${new Date().toLocaleDateString('he-IL')}
📊 סך הוצאות: ₪${total.toFixed(2)}
📝 מספר הוצאות: ${expenses.length}

───────────────────────────────────────────
📈 פירוט לפי קטגוריה:
───────────────────────────────────────────
`

  categories.forEach((amount, category) => {
    const percentage = ((amount / total) * 100).toFixed(1)
    report += `${category}: ₪${amount.toFixed(2)} (${percentage}%)\n`
  })

  report += `
───────────────────────────────────────────
💡 סטטיסטיקות:
───────────────────────────────────────────
ממוצע הוצאה: ₪${(total / expenses.length).toFixed(2)}
הוצאה מקסימלית: ₪${Math.max(...expenses.map((e) => e.amount)).toFixed(2)}
הוצאה מינימלית: ₪${Math.min(...expenses.map((e) => e.amount)).toFixed(2)}

═══════════════════════════════════════════
    נוצר בעזרת Budget Buddy 🤖
═══════════════════════════════════════════
`

  return report
}

export function downloadReport(expenses: any[]) {
  const report = generateReport(expenses)
  const blob = new Blob([report], { type: 'text/plain;charset=utf-8' })
  const link = document.createElement('a')

  link.href = URL.createObjectURL(blob)
  link.download = `budget-report-${new Date().toISOString().split('T')[0]}.txt`
  link.click()

  URL.revokeObjectURL(link.href)
}
