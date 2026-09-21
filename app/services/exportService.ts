import { Meal } from '../types'

interface ExportMeal extends Meal {
  dateLogged?: string
}

interface ExportData {
  exportDate: string
  meals: ExportMeal[]
  summary: {
    totalMeals: number
    totalCalories: number
    completedMeals: number
  }
}

export function exportToJSON(meals: Meal[] | undefined, fileName: string = 'life-balance-meals'): void {
  if (!meals || meals.length === 0) {
    alert('אין נתונים לייצוא')
    return
  }

  const exportData: ExportData = {
    exportDate: new Date().toISOString(),
    meals: meals.map(meal => ({
      ...meal,
      dateLogged: new Date().toISOString().split('T')[0]
    })),
    summary: {
      totalMeals: meals.length,
      totalCalories: meals.reduce((sum, m) => sum + (m.calories || 0), 0),
      completedMeals: meals.filter(m => m.completed).length
    }
  }

  const jsonString = JSON.stringify(exportData, null, 2)
  downloadFile(jsonString, `${fileName}.json`, 'application/json')
}

export function exportToCSV(meals: Meal[] | undefined, fileName: string = 'life-balance-meals'): void {
  if (!meals || meals.length === 0) {
    alert('אין נתונים לייצוא')
    return
  }

  const headers = ['שם ארוחה', 'סוג', 'שעה', 'קלוריות', 'הושלמה', 'הערות']
  const rows = meals.map(meal => [
    meal.name,
    meal.type,
    meal.time,
    meal.calories || '',
    meal.completed ? 'כן' : 'לא',
    meal.notes || ''
  ])

  const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
  downloadFile(csv, `${fileName}.csv`, 'text/csv;charset=utf-8;')
}

export function exportToReport(meals: Meal[] | undefined, userName: string = 'משתמש'): void {
  if (!meals || meals.length === 0) {
    alert('אין נתונים לייצוא')
    return
  }

  const totalMeals = meals.length
  const completedMeals = meals.filter(m => m.completed).length
  const totalCalories = meals.reduce((sum, m) => sum + (m.calories || 0), 0)
  const avgCalories = totalMeals > 0 ? Math.round(totalCalories / totalMeals) : 0

  const reportDate = new Date().toLocaleDateString('he-IL')
  const reportTime = new Date().toLocaleTimeString('he-IL')

  let report = `
╔═══════════════════════════════════════════════════╗
║          דוח Life Balance - ארוחות             ║
╚═══════════════════════════════════════════════════╝

👤 משתמש: ${userName}
📅 תאריך ייצוא: ${reportDate}
⏰ שעה: ${reportTime}

═══════════════════════════════════════════════════

📊 סטטיסטיקה כוללת:
───────────────────────────────────────────────────
• סה"כ ארוחות: ${totalMeals}
• ארוחות שהושלמו: ${completedMeals}
• אחוז השלמה: ${totalMeals > 0 ? Math.round((completedMeals / totalMeals) * 100) : 0}%
• סה"כ קלוריות: ${totalCalories}
• ממוצע קלוריות: ${avgCalories}

═══════════════════════════════════════════════════

🍽️ פירוט ארוחות:
───────────────────────────────────────────────────
`

  meals.forEach((meal, index) => {
    report += `
${index + 1}. ${meal.name}
   סוג: ${meal.type} | שעה: ${meal.time}
   קלוריות: ${meal.calories || 'לא צוין'} | ${meal.completed ? '✅ הושלמה' : '❌ לא הושלמה'}
   ${meal.notes ? `הערות: ${meal.notes}` : ''}`
  })

  report += `

═══════════════════════════════════════════════════

📝 הערות:
───────────────────────────────────────────────────
דוח זה צור באופן אוטומטי על ידי Life Balance.
לעודכון נתונים, אנא חזור לאפליקציה.

═══════════════════════════════════════════════════
  `

  downloadFile(report, `life-balance-report-${new Date().getTime()}.txt`, 'text/plain;charset=utf-8;')
}

function downloadFile(content: string, fileName: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', fileName)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
