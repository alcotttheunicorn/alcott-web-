'use client'

import { formatChatTime } from '@/lib/format-date'

const BRAND = '#4043FF'

// Minimal shape both real ticket messages (SupportTicketMessage) and the admin
// mock (SupportMessage) satisfy. `sender` is matched loosely so unknown backend
// values degrade to a neutral "Alcott Support" label rather than breaking.
export interface ChatMessage {
  sender: string
  text: string
  createdAt: string
}

function SenderBadge({ sender }: { sender: string }) {
  if (sender === 'USER') return null
  return (
    <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-[#eafff2] px-2 py-0.5 text-[11px] font-semibold text-[#0a7d38]">
      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      Alcott Support
    </span>
  )
}

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.sender === 'USER'

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      <SenderBadge sender={message.sender} />
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed sm:max-w-[70%] ${
          isUser
            ? 'rounded-br-md text-white'
            : 'rounded-bl-md border border-gray-200 bg-white text-gray-800'
        }`}
        style={isUser ? { backgroundColor: BRAND } : undefined}
      >
        {message.text.split(/\n+/).map((para, i) => (
          <p key={i} className={i > 0 ? 'mt-2' : undefined}>
            {para}
          </p>
        ))}
      </div>
      <span className="mt-1 px-1 text-[11px] text-gray-400">{formatChatTime(message.createdAt)}</span>
    </div>
  )
}

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 self-start rounded-2xl rounded-bl-md border border-gray-200 bg-white px-4 py-3">
      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
      <span className="ml-1 text-xs text-gray-500">Sending…</span>
    </div>
  )
}
