'use client'

import { useState } from 'react'

type GenerateResponse = {
  code?: string
  files?: Record<string, string>
}

export function useGeneration(initialCode: string) {
  const [code, setCode] = useState(initialCode)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = async (prompt: string) => {
    if (!prompt.trim()) {
      return
    }

    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      if (!res.ok) {
        let detail = `Request failed (${res.status})`
        try {
          const errorData = (await res.json()) as { error?: string }
          if (errorData.error) {
            detail = `${detail}: ${errorData.error}`
          }
        } catch {
          // Keep generic status detail when no JSON error payload is returned.
        }
        throw new Error(detail)
      }

      const data: GenerateResponse = await res.json()
      const nextCode = data.code ?? data.files?.['/App.tsx']

      if (nextCode) {
        setCode(nextCode)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return {
    code,
    error,
    loading,
    setCode,
    generate,
  }
}
