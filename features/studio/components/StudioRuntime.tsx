"use client"

import { useEffect, useState } from "react"
import SandboxPreview from "./SandboxPreview"
import CollaborativeCodeEditor from "./CollaborativeCodeEditor"

export default function StudioRuntime() {
  const [code] = useState(`<div class='p-10'>Edit me</div>`)
  const [roomKey, setRoomKey] = useState<string | null>(null)
  const projectId = "demo-project"

  useEffect(() => {
    async function createRoom() {
      const response = await fetch(`/api/projects/${projectId}/realtime/room`, {
        method: "POST",
      })
      const payload = await response.json()
      setRoomKey(payload.room?.roomKey ?? null)
    }
    void createRoom()
  }, [])

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white">
      {/* Editor */}
      <div className="w-1/2 border-r border-[#C9A24A]/20">
        {roomKey ? (
          <CollaborativeCodeEditor projectId={projectId} roomKey={roomKey} filePath="/App.tsx" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-white/50">
            Booting realtime room…
          </div>
        )}
      </div>

      {/* Live Preview */}
      <div className="w-1/2">
        <SandboxPreview code={code} />
      </div>
    </div>
  )
}
