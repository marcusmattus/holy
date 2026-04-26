'use client'

import { useEffect, useMemo, useState } from 'react'

type Session = {
  id: string
  userId: string
  lastSeenAt: string
  metadata?: Record<string, unknown>
  user?: { email?: string }
}

export function usePresence(projectId: string, userId: string) {
  const [sessions, setSessions] = useState<Session[]>([])

  useEffect(() => {
    let cancelled = false

    async function poll() {
      if (!projectId || !userId) return

      await fetch(`/api/projects/${projectId}/presence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      const response = await fetch(
        `/api/projects/${projectId}/presence?userId=${encodeURIComponent(userId)}`,
      )

      if (!response.ok || cancelled) {
        return
      }

      const data = (await response.json()) as { sessions?: Session[] }
      setSessions(data.sessions ?? [])
    }

    poll()
    const interval = setInterval(poll, 5_000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [projectId, userId])

  const activeCount = useMemo(() => sessions.length, [sessions])

  return { sessions, activeCount }
}
