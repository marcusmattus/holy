'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const INITIAL_MESSAGES: Message[] = [
  {
    role: 'assistant',
    content:
      "✦ Holy AI ready. Describe what you want to build and I'll generate the code for you.",
  },
]

export function AIAssistant({ projectId }: { projectId: string }) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')

  const send = () => {
    if (!input.trim()) return
    const userMsg: Message = { role: 'user', content: input }
    setMessages((prev) => [
      ...prev,
      userMsg,
      {
        role: 'assistant',
        content: `Generating component for: "${input}"\n\nCode generated and applied to editor. ✦`,
      },
    ])
    setInput('')
  }

  return (
    <div
      className="w-80 flex-shrink-0 flex flex-col border-l border-border bg-card"
      data-project={projectId}
    >
      <div className="px-4 py-2 border-b border-border">
        <span className="text-xs font-semibold text-[#7C3AED]">✦ Holy AI</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`text-xs rounded-lg px-3 py-2 ${
              msg.role === 'assistant'
                ? 'bg-[#7C3AED]/10 text-foreground border border-[#7C3AED]/20'
                : 'bg-muted text-foreground ml-4'
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Describe what to build..."
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-[#7C3AED]/50"
          />
          <button
            onClick={send}
            className="rounded-lg bg-[#7C3AED] p-2 text-white hover:bg-[#6D28D9] transition-colors"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
