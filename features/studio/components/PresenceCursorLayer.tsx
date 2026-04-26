"use client"

import { useRealtimePresence } from '@/features/studio/realtime/useRealtimePresence'

export default function PresenceCursorLayer() {
  const collaborators = useRealtimePresence((state) => state.collaborators)

  return (
    <div className="rounded-lg border border-[#C9A24A]/20 bg-white/5 p-3">
      <p className="mb-2 text-xs uppercase tracking-wide text-[#C9A24A]">Live presence</p>
      <div className="flex flex-wrap gap-2">
        {collaborators.length === 0 ? (
          <span className="text-xs text-white/40">No active collaborators</span>
        ) : (
          collaborators.map((collaborator) => (
            <span
              key={collaborator.userId}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-2 py-1 text-xs"
            >
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: collaborator.color }}
              />
              {collaborator.name}
            </span>
          ))
        )}
      </div>
    </div>
  )
}
