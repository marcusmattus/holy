"use client"

import { useEffect, useState } from 'react'
import MonacoEditor from '@/features/studio/components/MonacoEditor'
import RealtimeStatusBar from '@/features/studio/components/RealtimeStatusBar'
import PresenceCursorLayer from '@/features/studio/components/PresenceCursorLayer'
import { useRealtimeFile } from '@/features/studio/realtime/useRealtimeFile'

const AUTO_SAVE_DEBOUNCE_MS = 1500

export default function CollaborativeCodeEditor({
  projectId,
  roomKey,
  filePath,
  onContentChange,
}: {
  projectId: string
  roomKey: string
  filePath: string
  onContentChange?: (content: string) => void
}) {
  const [autoSaveLabel, setAutoSaveLabel] = useState('Auto-save enabled')
  const { content, setContent, isConnected, isReconnecting, saveSnapshot } = useRealtimeFile({
    roomKey,
    projectId,
    filePath,
    initialContent: `<div class='p-10 text-[#C9A24A]'>Realtime collaboration enabled</div>`,
    userId: 'demo-user',
    name: 'Demo User',
    color: '#C9A24A',
  })

  useEffect(() => {
    const timeout = setTimeout(async () => {
      setAutoSaveLabel('Saving…')
      await saveSnapshot()
      setAutoSaveLabel('Auto-saved')
    }, AUTO_SAVE_DEBOUNCE_MS)
    return () => clearTimeout(timeout)
  }, [content, saveSnapshot])

  useEffect(() => {
    onContentChange?.(content)
  }, [content, onContentChange])

  return (
    <div className="flex h-full flex-col gap-2 bg-[#0A0A0A] p-3">
      <RealtimeStatusBar connected={isConnected} reconnecting={isReconnecting} autoSaveLabel={autoSaveLabel} />
      <div className="h-[70vh] overflow-hidden rounded-lg border border-[#C9A24A]/20">
        <MonacoEditor code={content} onChange={setContent} />
      </div>
      <PresenceCursorLayer />
      <button
        onClick={saveSnapshot}
        className="rounded-md border border-[#C9A24A] bg-[#C9A24A]/10 px-3 py-2 text-xs text-[#C9A24A] hover:bg-[#C9A24A]/20"
      >
        Save snapshot
      </button>
    </div>
  )
}
