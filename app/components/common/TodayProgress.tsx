interface TodayProgressProps {
  percentage: number
}

export default function TodayProgress({ percentage }: TodayProgressProps) {
  const getColor = () => {
    if (percentage >= 80) return 'from-green-500 to-emerald-500'
    if (percentage >= 50) return 'from-yellow-500 to-yellow-600'
    return 'from-red-500 to-red-600'
  }

  const getEmoji = () => {
    if (percentage >= 100) return '🏆'
    if (percentage >= 80) return '🌟'
    if (percentage >= 50) return '⭐'
    return '📌'
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg">
          {getEmoji()} התקדמות היום
        </h3>
        <span className="text-2xl font-bold text-blue-300">{percentage}%</span>
      </div>
      <div className="progress-bar">
        <div
          className={`progress-fill bg-gradient-to-r ${getColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-sm text-slate-400 mt-3">
        {percentage >= 100
          ? '🎉 מעולה! השלמת את כל המשימות שלך!'
          : percentage >= 80
          ? '💪 כמעט שם! עוד קצת...'
          : percentage >= 50
          ? '⏳ חצי דרך! המשך כך!'
          : '🚀 התחל את היום שלך!'}
      </p>
    </div>
  )
}
