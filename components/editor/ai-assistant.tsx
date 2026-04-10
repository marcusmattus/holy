'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, ChevronDown } from 'lucide-react'
import { useAtom } from 'jotai'
import { editorCodeAtom, selectedModelAtom, AI_MODELS, type AIModelId } from '@/lib/atoms'
import { useChat } from 'ai/react'

function extractCode(content: string): string | null {
  const match = content.match(/```(?:tsx?|jsx?|js|ts)\n([\s\S]*?)```/)
  return match ? match[1].trim() : null
}

export function AIAssistant({ projectId }: { projectId: string }) {
  const [, setEditorCode] = useAtom(editorCodeAtom)
  const [selectedModel, setSelectedModel] = useAtom(selectedModelAtom)
  const [modelMenuOpen, setModelMenuOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/ai/chat',
    body: { model: selectedModel },
    onFinish(message) {
      const code = extractCode(message.content)
      if (code) setEditorCode(code)
    },
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const currentModel = AI_MODELS.find((m) => m.id === selectedModel)

  return (
    <div
      className="w-80 flex-shrink-0 flex flex-col border-l border-border bg-card"
      data-project={projectId}
    >
      {/* Header */}
      <div className="px-4 py-2 border-b border-border flex items-center justify-between">
        <span className="text-xs font-semibold text-[#7C3AED]">✦ Holy AI</span>
        <div className="relative">
          <button
            onClick={() => setModelMenuOpen((o) => !o)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors rounded px-1.5 py-0.5 hover:bg-muted"
          >
            {currentModel?.label ?? selectedModel}
            <ChevronDown size={10} />
          </button>
          {modelMenuOpen && (
            <div className="absolute right-0 top-full mt-1 z-50 w-48 rounded-lg border border-border bg-card shadow-xl">
              {AI_MODELS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedModel(m.id as AIModelId)
                    setModelMenuOpen(false)
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg ${
                    m.id === selectedModel ? 'text-[#7C3AED] font-medium' : 'text-foreground'
                  }`}
                >
                  <span className="text-muted-foreground mr-1.5 capitalize">{m.provider}</span>
                  {m.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-xs rounded-lg px-3 py-2 bg-[#7C3AED]/10 text-foreground border border-[#7C3AED]/20">
            ✦ Holy AI ready. Describe what you want to build and I&apos;ll generate the code for you.
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`text-xs rounded-lg px-3 py-2 ${
              msg.role === 'assistant'
                ? 'bg-[#7C3AED]/10 text-foreground border border-[#7C3AED]/20'
                : 'bg-muted text-foreground ml-4'
            }`}
          >
            <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
          </div>
        ))}
        {isLoading && (
          <div className="text-xs rounded-lg px-3 py-2 bg-[#7C3AED]/10 text-foreground border border-[#7C3AED]/20 animate-pulse">
            ✦ Generating...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Describe what to build..."
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-[#7C3AED]/50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-lg bg-[#7C3AED] p-2 text-white hover:bg-[#6D28D9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  )
}
