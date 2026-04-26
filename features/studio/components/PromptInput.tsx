'use client'

import { useState } from 'react'

type PromptInputProps = {
  onGenerate: (prompt: string) => void | Promise<void>
  loading?: boolean
  error?: string | null
}

export default function PromptInput({ onGenerate, loading = false, error = null }: PromptInputProps) {
  const [prompt, setPrompt] = useState('')

  return (
    <div className="border-b p-2">
      <div className="flex gap-2">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your app idea..."
          className="flex-1 border p-2"
        />
        <button
          onClick={() => onGenerate(prompt)}
          className="border px-3 py-2 disabled:opacity-50"
          disabled={loading || !prompt.trim()}
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  )
}
