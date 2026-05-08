'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Copy, Check, RefreshCw } from 'lucide-react'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  streaming?: boolean
}

const WELCOME: Message = {
  id: 'welcome',
  role: 'assistant',
  content:
    '✦ Holy AI ready.\n\nDescribe a UI change, ask me to add a feature, or say "refactor this component" — I\'ll generate the code.',
}

export function AIAssistant({ projectId }: { projectId: string }) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([WELCOME])
  const [isStreaming, setIsStreaming] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const copyCode = (content: string, id: string) => {
    navigator.clipboard.writeText(content)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || isStreaming) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
    }
    const assistantId = (Date.now() + 1).toString()
    const assistantMsg: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      streaming: true,
    }

    setMessages((prev) => [...prev, userMsg, assistantMsg])
    setInput('')
    setIsStreaming(true)

    try {
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }))

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          messages: [...history, { role: 'user', content: text }],
        }),
      })

      if (!res.ok) throw new Error('API error')
      if (!res.body) throw new Error('No stream')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: accumulated }
              : m,
          ),
        )
      }

      // Mark streaming done
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, streaming: false } : m,
        ),
      )
    } catch (err) {
      console.error(err)
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content: '⚠ Something went wrong. Please try again.',
                streaming: false,
              }
            : m,
        ),
      )
    } finally {
      setIsStreaming(false)
      inputRef.current?.focus()
    }
  }

  const reset = () => {
    setMessages([WELCOME])
    setInput('')
  }

  return (
    <div className="w-80 flex-shrink-0 flex flex-col border-l border-border bg-card/50 backdrop-blur-xl relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#C9A24A]/5 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50 flex items-center space-x-2 relative z-10">
        <Sparkles className="w-4 h-4 text-[#C9A24A]" />
        <span className="text-xs font-bold tracking-widest uppercase text-[#C9A24A]">
          Holy AI
        </span>
        {isStreaming && (
          <div className="flex space-x-1 ml-2">
            {[0, 0.2, 0.4].map((delay) => (
              <div
                key={delay}
                className="w-1 h-1 rounded-full bg-[#C9A24A] animate-pulse"
                style={{ animationDelay: `${delay}s` }}
              />
            ))}
          </div>
        )}
        <div className="flex-1" />
        <button
          onClick={reset}
          title="Clear chat"
          className="p-1 rounded hover:bg-white/10 text-white/30 hover:text-white/70 transition-colors"
        >
          <RefreshCw size={12} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 relative z-10">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`text-xs rounded-2xl px-4 py-3 group relative ${
              msg.role === 'assistant'
                ? 'bg-white/5 border border-[#C9A24A]/20 text-foreground'
                : 'bg-muted/30 text-foreground ml-4 border border-border/30'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className={`text-[10px] font-black uppercase tracking-widest ${
                  msg.role === 'assistant' ? 'text-[#C9A24A]' : 'text-white/40'
                }`}
              >
                {msg.role === 'assistant' ? 'Holy' : 'You'}
              </span>
              {msg.role === 'assistant' && !msg.streaming && msg.content && (
                <button
                  onClick={() => copyCode(msg.content, msg.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-white/10"
                >
                  {copied === msg.id ? (
                    <Check size={10} className="text-[#10B981]" />
                  ) : (
                    <Copy size={10} className="text-white/40" />
                  )}
                </button>
              )}
            </div>
            <div className="leading-relaxed whitespace-pre-wrap break-words">
              {msg.content}
              {msg.streaming && (
                <span className="inline-block w-1.5 h-3 bg-[#C9A24A] animate-pulse ml-0.5 rounded-sm" />
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border/50 relative z-10">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Holy AI anything…"
            disabled={isStreaming}
            className="flex-1 rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-[#C9A24A]/50 focus:border-[#C9A24A]/50 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="rounded-2xl bg-[#C9A24A] p-2.5 text-black hover:bg-[#C9A24A]/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send size={14} />
          </button>
        </form>
        <p className="text-[9px] text-white/20 mt-2 text-center uppercase tracking-widest">
          Natural Language UI Engine
        </p>
      </div>
    </div>
  )
}
