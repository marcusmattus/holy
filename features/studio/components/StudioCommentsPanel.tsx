'use client'

import { useState } from 'react'
import { useStudioComments } from '@/features/studio/collaboration/useStudioComments'

export default function StudioCommentsPanel({
  projectId,
  userId,
}: {
  projectId: string
  userId: string
}) {
  const [draft, setDraft] = useState('')
  const { comments, addComment, resolveComment } = useStudioComments(projectId, userId)

  return (
    <aside className="w-80 border-l border-[#C9A24A]/20 bg-white/5 backdrop-blur p-4">
      <p className="text-[10px] uppercase tracking-wider text-[#C9A24A]">Studio comments</p>
      <div className="mt-3 space-y-2 max-h-[50vh] overflow-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="rounded-lg border border-white/10 p-3">
            <p className="text-xs text-white/70">{comment.user?.email ?? 'Unknown'}</p>
            <p className="text-sm text-white mt-1">{comment.body}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[10px] uppercase text-[#C9A24A]">{comment.status}</span>
              {comment.status === 'OPEN' ? (
                <button
                  onClick={() => resolveComment(comment.id)}
                  className="text-xs px-2 py-1 rounded border border-[#C9A24A]/50 text-[#C9A24A]"
                >
                  Resolve
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className="flex-1 rounded border border-white/20 bg-black/40 px-2 py-1 text-sm"
          placeholder="Comment on current change"
        />
        <button
          onClick={async () => {
            await addComment(draft)
            setDraft('')
          }}
          className="rounded bg-[#C9A24A] text-black px-3 py-1 text-sm font-medium"
        >
          Add
        </button>
      </div>
    </aside>
  )
}
