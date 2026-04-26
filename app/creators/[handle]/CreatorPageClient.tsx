'use client'

import { useEffect, useState } from 'react'

type CreatorPayload = {
  creator?: {
    handle: string
    bio?: string | null
    user: {
      templates: { id: string; title: string }[]
      projects: { id: string; name: string }[]
    }
    metrics: {
      followers: number
      publishedApps: number
      templates: number
    }
  }
}

export default function CreatorPageClient({ handle }: { handle: string }) {
  const [payload, setPayload] = useState<CreatorPayload['creator']>()

  useEffect(() => {
    async function loadCreator() {
      const response = await fetch(`/api/creators/${handle}`)
      if (!response.ok) return
      const data = (await response.json()) as CreatorPayload
      setPayload(data.creator)
    }

    loadCreator()
  }, [handle])

  if (!payload) {
    return <p className="text-sm text-white/70">Loading creator profile...</p>
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-[#C9A24A]/30 bg-white/5 p-5 backdrop-blur">
        <p className="text-[10px] uppercase tracking-wider text-[#C9A24A]">Creator profile</p>
        <h1 className="mt-2 text-2xl font-semibold">@{payload.handle}</h1>
        <p className="mt-2 text-sm text-white/70">{payload.bio ?? 'No bio yet.'}</p>
        <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
          <div className="rounded border border-white/10 p-3">Followers: {payload.metrics.followers}</div>
          <div className="rounded border border-white/10 p-3">Apps: {payload.metrics.publishedApps}</div>
          <div className="rounded border border-white/10 p-3">Templates: {payload.metrics.templates}</div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="text-sm font-semibold">Published Apps</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            {payload.user.projects.map((project) => (
              <li key={project.id}>{project.name}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="text-sm font-semibold">Templates</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            {payload.user.templates.map((template) => (
              <li key={template.id}>{template.title}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
