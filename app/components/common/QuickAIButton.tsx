export default function QuickAIButton() {
  const suggestedQuestions = [
    'מה כדאי לי לאכול עכשיו?',
    'איך הסטריק שלי?',
    'תכנן לי ארוחות למחר',
    'תן לי טיפ בריאותי',
    'איך נראה השבוע שלי?',
    'מה הצעות לחיסכון?'
  ]

  const getRandomQuestion = () => {
    return suggestedQuestions[Math.floor(Math.random() * suggestedQuestions.length)]
  }

  return (
    <div className="card bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30">
      <div className="flex items-center gap-3">
        <span className="text-2xl animate-pulse-glow">🤖</span>
        <div className="flex-1">
          <p className="text-sm font-medium mb-2">שאל את העוזר:</p>
          <div className="bg-slate-700/50 rounded-lg p-3 text-sm text-slate-300">
            "{getRandomQuestion()}"
          </div>
        </div>
      </div>
      <button className="btn-primary w-full mt-3">
        💬 צא לעוזר
      </button>
    </div>
  )
}
