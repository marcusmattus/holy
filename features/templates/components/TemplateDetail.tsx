'use client'

import { useState } from 'react'

type TemplateDetailProps = {
  templateId: string
  title: string
  description: string
  category?: string | null
  creator?: string
  priceLabel: string
  forks: number
}

export default function TemplateDetail(props: TemplateDetailProps) {
  const [forking, setForking] = useState(false)
  const [forkedProjectId, setForkedProjectId] = useState<string | null>(null)
  const [currentUserId] = useState(() => {
    if (typeof window === 'undefined') return 'anonymous-user'
    return window.localStorage.getItem('holy_user_id') ?? 'anonymous-user'
  })

  return (
    <div className="rounded-xl border border-[#C9A24A]/30 bg-white/5 p-6 backdrop-blur space-y-4">
      <p className="text-[10px] uppercase tracking-wider text-[#C9A24A]">{props.category ?? 'General'}</p>
      <h1 className="text-2xl font-semibold">{props.title}</h1>
      <p className="text-white/80">{props.description}</p>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded border border-white/10 p-3">Price: {props.priceLabel}</div>
        <div className="rounded border border-white/10 p-3">Forks: {props.forks}</div>
        <div className="rounded border border-white/10 p-3">Creator: {props.creator ?? 'Creator'}</div>
        <div className="rounded border border-white/10 p-3">Related: Coming soon</div>
      </div>
      <button
        onClick={async () => {
          setForking(true)
          const response = await fetch(`/api/templates/${props.templateId}/fork`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUserId }),
          })

          if (response.ok) {
            const data = (await response.json()) as { project?: { id?: string } }
            setForkedProjectId(data.project?.id ?? null)
          }

          setForking(false)
        }}
        className="rounded bg-[#C9A24A] px-4 py-2 text-black font-medium"
      >
        {forking ? 'Forking...' : 'Use Template'}
      </button>
      {forkedProjectId ? <p className="text-sm text-green-400">Created project: {forkedProjectId}</p> : null}
    </div>
  )
}
