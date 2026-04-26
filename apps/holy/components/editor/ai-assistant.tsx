'use client'

import { useState } from 'react'
// @ts-ignore - AI SDK types
import { Message, useChat } from 'ai/react'
import { Send, Sparkles } from 'lucide-react'

export function AIAssistant({ projectId }: { projectId: string }) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: '/api/ai/chat',
      body: { projectId },
      initialMessages: [
        {
          id: '1',
          role: 'assistant',
          content:
            '✦ Holy AI ready. Describe what you want to build and I will generate the code for you.',
        },
      ],
    })

  return (
    <div className="w-80 flex-shrink-0 flex flex-col border-l border-border bg-card/50 backdrop-blur-xl relative">
      {/* Ethereal background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#C9A24A]/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="px-4 py-3 border-b border-border/50 flex items-center space-x-2 relative z-10">
        <Sparkles className="w-4 h-4 text-[#C9A24A]" />
        <span className="text-xs font-bold tracking-widest uppercase text-[#C9A24A]">
          Holy AI
        </span>
        {isLoading && (
          <div className="flex space-x-1 ml-auto">
            <div className="w-1 h-1 rounded-full bg-[#C9A24A] streaming-dot" />
            <div
              className="w-1 h-1 rounded-full bg-[#C9A24A] streaming-dot"
              style={{ animationDelay: '0.2s' }}
            />
            <div
              className="w-1 h-1 rounded-full bg-[#C9A24A] streaming-dot"
              style={{ animationDelay: '0.4s' }}
            />
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3 relative z-10">
        {messages.map((msg: Message) => (
          <div
            key={msg.id}
            className={`text-xs rounded-2xl px-4 py-3 ${
              msg.role === 'assistant'
                ? 'glass-panel text-foreground border-[#C9A24A]/20'
                : 'bg-muted/30 text-foreground ml-4 border border-border/30'
            }`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <span
                className={`text-[10px] font-black uppercase tracking-widest ${
                  msg.role === 'assistant' ? 'text-[#C9A24A]' : 'text-white/40'
                }`}
              >
                {msg.role === 'assistant' ? 'Holy' : 'You'}
              </span>
            </div>
            <div className="leading-relaxed whitespace-pre-wrap">{msg.content}</div>
          </div>
        ))}
      </div>
      
      <div className="p-3 border-t border-border/50 relative z-10">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1 group">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Describe what to build..."
              disabled={isLoading}
              className="w-full rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-[#C9A24A]/50 focus:border-[#C9A24A]/50 transition-all disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-2xl bg-[#C9A24A] p-2.5 text-black hover:bg-[#C9A24A]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed gold-glow"
          >
            <Send size={14} />
          </button>
        </form>
        <p className="text-[9px] text-white/20 mt-3 text-center uppercase tracking-widest">
          Natural Language UI Engine v2.4
        </p>
      </div>
    </div>
  )
}
