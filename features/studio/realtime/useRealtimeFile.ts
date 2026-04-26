"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { useRealtimePresence } from '@/features/studio/realtime/useRealtimePresence'

type UseRealtimeFileParams = {
  roomKey: string
  projectId: string
  filePath: string
  initialContent: string
  userId: string
  name: string
  color: string
}

export function useRealtimeFile({
  roomKey,
  projectId,
  filePath,
  initialContent,
  userId,
  name,
  color,
}: UseRealtimeFileParams) {
  const [content, setContentState] = useState(initialContent)
  const [isConnected, setIsConnected] = useState(false)
  const [isReconnecting, setIsReconnecting] = useState(false)
  const providerRef = useRef<WebsocketProvider | null>(null)
  const yDocRef = useRef<Y.Doc | null>(null)
  const yTextRef = useRef<Y.Text | null>(null)
  const setCollaborators = useRealtimePresence((state) => state.setCollaborators)

  const roomName = useMemo(() => `${roomKey}:${filePath}`, [filePath, roomKey])

  useEffect(() => {
    const yDoc = new Y.Doc()
    yDocRef.current = yDoc
    const provider = new WebsocketProvider(
      process.env.NEXT_PUBLIC_YJS_WS_URL ?? 'wss://demos.yjs.dev/ws',
      roomName,
      yDoc
    )
    providerRef.current = provider

    const yText = yDoc.getText('content')
    yTextRef.current = yText
    if (yText.length === 0 && initialContent) {
      yText.insert(0, initialContent)
    }
    const updateText = () => {
      setContentState(yText.toString())
    }
    yText.observe(updateText)

    const awareness = provider.awareness
    awareness.setLocalStateField('user', { userId, name, color })

    const awarenessListener = () => {
      const users = Array.from(awareness.getStates().values())
        .map((state) => state.user as { userId: string; name: string; color: string } | undefined)
        .filter((user): user is { userId: string; name: string; color: string } => Boolean(user))
        .map((user) => ({
          userId: user.userId,
          name: user.name,
          color: user.color,
          cursorLine: 1,
          cursorColumn: 1,
        }))
      setCollaborators(users)
    }
    awareness.on('change', awarenessListener)
    awarenessListener()

    provider.on('status', (event: { status: 'connected' | 'disconnected' | 'connecting' }) => {
      const connected = event.status === 'connected'
      setIsConnected(connected)
      setIsReconnecting(event.status === 'connecting')
    })

    return () => {
      awareness.off('change', awarenessListener)
      yText.unobserve(updateText)
      provider.destroy()
      yDoc.destroy()
      setCollaborators([])
    }
  }, [initialContent, name, roomName, setCollaborators, userId, color])

  const setContent = (nextContent: string) => {
    const yText = yTextRef.current
    if (!yText) return
    yText.delete(0, yText.length)
    yText.insert(0, nextContent)
  }

  const saveSnapshot = useCallback(async () => {
    await fetch(`/api/projects/${projectId}/realtime/snapshot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filePath, content }),
    })
  }, [content, filePath, projectId])

  return {
    content,
    setContent,
    isConnected,
    isReconnecting,
    saveSnapshot,
  }
}
