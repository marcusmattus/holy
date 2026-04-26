'use client'

import { usePresence } from '@/features/studio/collaboration/usePresence'

export default function CollaboratorAvatars({
  projectId,
  userId,
}: {
  projectId: string
  userId: string
}) {
  const { sessions, activeCount } = usePresence(projectId, userId)

  return (
    <div className="rounded-xl border border-[#C9A24A]/30 bg-white/5 backdrop-blur px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-[#C9A24A]">Collaborators</p>
      <div className="mt-2 flex items-center gap-2">
        {sessions.slice(0, 5).map((session) => (
          <div
            key={session.id}
            className="h-7 w-7 rounded-full border border-[#C9A24A]/50 bg-[#0A0A0A] text-[10px] font-semibold text-[#F8FAFC] flex items-center justify-center"
            title={session.user?.email ?? session.userId}
          >
            {(session.user?.email ?? session.userId).slice(0, 2).toUpperCase()}
          </div>
        ))}
        <span className="text-xs text-[#E5E7EB]">{activeCount} active</span>
      </div>
    </div>
  )
}
