"use client"

import { useState } from 'react'

export default function StudioLayout() {
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  async function handleGenerate() {
    setLoading(true)
    const res = await fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt })
    })
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  return (
    <div className="flex h-screen">
      {/* Left panel */}
      <div className="w-1/2 p-4 border-r flex flex-col gap-4">
        <textarea
          className="w-full h-40 border p-2"
          placeholder="Describe your app idea..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          onClick={handleGenerate}
          className="bg-black text-white p-2"
        >
          {loading ? 'Generating...' : 'Generate App'}
        </button>

        <pre className="text-xs overflow-auto">
          {result?.spec}
        </pre>
      </div>

      {/* Right panel */}
      <div className="w-1/2 p-4">
        <iframe
          className="w-full h-full border"
          srcDoc={result?.code || '<div>Preview will appear here</div>'}
        />
      </div>
    </div>
  )
}
