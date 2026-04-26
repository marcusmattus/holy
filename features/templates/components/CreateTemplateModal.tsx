'use client'

import { useState } from 'react'

export default function CreateTemplateModal({ projectId }: { projectId: string }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [open, setOpen] = useState(false)

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded border border-[#C9A24A]/40 px-3 py-2 text-sm text-[#C9A24A]"
      >
        Publish as Template
      </button>
    )
  }

  return (
    <div className="rounded-xl border border-[#C9A24A]/30 bg-black/70 p-4 backdrop-blur space-y-3">
      <input
        className="w-full rounded border border-white/20 bg-black/40 px-2 py-1"
        placeholder="Template title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <textarea
        className="w-full rounded border border-white/20 bg-black/40 px-2 py-1"
        placeholder="Template description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <div className="flex gap-2">
        <button
          onClick={async () => {
            await fetch(`/api/projects/${projectId}/template`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ creatorId: 'demo-user', title, description }),
            })
            setOpen(false)
            setTitle('')
            setDescription('')
          }}
          className="rounded bg-[#C9A24A] px-3 py-1 text-black"
        >
          Publish
        </button>
        <button onClick={() => setOpen(false)} className="rounded border border-white/20 px-3 py-1">
          Cancel
        </button>
      </div>
    </div>
  )
}
