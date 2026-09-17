interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 message-enter`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
          isUser
            ? 'bg-indigo-600 text-white rounded-tr-none'
            : 'bg-gray-700 text-gray-100 rounded-tl-none'
        }`}
      >
        <p className="break-words">{content}</p>
        {timestamp && (
          <p className={`text-xs mt-2 ${isUser ? 'text-indigo-200' : 'text-gray-400'}`}>
            {timestamp.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  )
}
