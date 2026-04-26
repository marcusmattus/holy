'use client'

import { useCallback, useEffect, useState } from 'react'

type StudioComment = {
  id: string
  body: string
  filePath?: string
  componentId?: string
  status: 'OPEN' | 'RESOLVED'
  user?: { email?: string }
}

export function useStudioComments(projectId: string, userId: string) {
  const [comments, setComments] = useState<StudioComment[]>([])

  const loadComments = useCallback(async () => {
    if (!projectId || !userId) return

    const response = await fetch(
      `/api/projects/${projectId}/comments?userId=${encodeURIComponent(userId)}`,
    )

    if (!response.ok) return

    const data = (await response.json()) as { comments?: StudioComment[] }
    setComments(data.comments ?? [])
  }, [projectId, userId])

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadComments()
    }, 0)

    return () => clearTimeout(timer)
  }, [loadComments])

  const addComment = useCallback(
    async (body: string, filePath?: string, componentId?: string) => {
      if (!body.trim()) return

      const response = await fetch(`/api/projects/${projectId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, userId, body, filePath, componentId }),
      })

      if (response.ok) {
        await loadComments()
      }
    },
    [projectId, userId, loadComments],
  )

  const resolveComment = useCallback(
    async (commentId: string) => {
      const response = await fetch(`/api/comments/${commentId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      if (response.ok) {
        await loadComments()
      }
    },
    [userId, loadComments],
  )

  return { comments, addComment, resolveComment, refresh: loadComments }
}
