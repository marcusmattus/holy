'use client'

import { useState } from 'react'

type GenerateResponse = {
  code?: string
  files?: Record<string, string>
}

export function useGeneration(initialCode: string) {
  const [code, setCode] = useState(initialCode)
  const [loading, setLoading] = useState(false)

  const generate = async (prompt: string) => {
    if (!prompt.trim()) {
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      const data: GenerateResponse = await res.json()
      const nextCode = data.code ?? data.files?.['/App.tsx']

      if (nextCode) {
        setCode(nextCode)
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    code,
    loading,
    setCode,
    generate,
  }
}
