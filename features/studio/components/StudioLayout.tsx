'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { ComponentInspector } from './ComponentInspector'
import { ComponentRegistryPanel } from './ComponentRegistryPanel'
import { VersionTimeline } from './VersionTimeline'
import { defaultComponentRegistry } from '@/features/studio/lib/component-registry'
import type { ComponentRegistryItem, HolyFileMap } from '@/features/studio/types'

const SandpackPreview = dynamic(() => import('./SandpackPreview'), { ssr: false })

const DEFAULT_FILES: HolyFileMap = {
  '/App.tsx': `export default function App() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] p-10 text-white">
      <section data-holy-id="hero" className="rounded-3xl border border-white/10 bg-white/[0.03] p-10">
        <h1 className="text-4xl font-bold">Launch your product with Holy</h1>
        <p className="mt-4 text-white/60">AI-native studio for building and shipping apps.</p>
      </section>
      <section data-holy-id="pricing" className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {['Free', 'Pro', 'Scale'].map((tier) => (
          <article key={tier} className="rounded-2xl border border-white/10 bg-black/30 p-6">
            <h2 className="text-xl font-bold">{tier}</h2>
            <p className="mt-3 text-white/60">Built for fast experiments and growth.</p>
          </article>
        ))}
      </section>
    </main>
  )
}`,
}

type Version = {
  id: string
  label: string | null
  prompt: string | null
  createdAt: string
}

export default function StudioLayout() {
  const [prompt, setPrompt] = useState('')
  const [files, setFiles] = useState<HolyFileMap>(DEFAULT_FILES)
  const [projectId, setProjectId] = useState<string | null>(null)
  const [projectStatus, setProjectStatus] = useState('DRAFT')
  const [projectName, setProjectName] = useState('Untitled Project')
  const [versions, setVersions] = useState<Version[]>([])
  const [selected, setSelected] = useState<ComponentRegistryItem | null>(defaultComponentRegistry[0] ?? null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [publishOpen, setPublishOpen] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null)
  const [publishForm, setPublishForm] = useState({
    title: 'Untitled Project',
    description: 'Generated in Holy Studio',
    category: 'App',
    priceType: 'FREE',
    priceCents: 0,
  })

  const selectedId = useMemo(() => selected?.id, [selected])

  useEffect(() => {
    async function loadProject() {
      const projectRes = await fetch('/api/projects')
      const existingProjects = await projectRes.json()
      let activeProject = existingProjects?.[0]

      if (!activeProject) {
        const createRes = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'Untitled Project' }),
        })
        activeProject = await createRes.json()
      }

      setProjectId(activeProject.id)
      setProjectStatus(activeProject.status ?? 'DRAFT')
      setProjectName(activeProject.name ?? 'Untitled Project')
      setPublishForm((prev) => ({ ...prev, title: activeProject.name ?? prev.title }))

      const fileRes = await fetch(`/api/projects/${activeProject.id}/files`)
      const fileData = await fileRes.json()
      if (fileData.files && Object.keys(fileData.files).length > 0) {
        setFiles(fileData.files)
      } else {
        await fetch(`/api/projects/${activeProject.id}/files`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ files: DEFAULT_FILES }),
        })
      }

      const versionsRes = await fetch(`/api/projects/${activeProject.id}/versions`)
      const versionsData = await versionsRes.json()
      setVersions(versionsData.versions ?? [])
    }

    void loadProject()
  }, [])

  async function syncFiles(nextFiles: HolyFileMap) {
    setFiles(nextFiles)
    if (!projectId) return

    await fetch(`/api/projects/${projectId}/files`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ files: nextFiles }),
    })
  }

  async function refreshVersions() {
    if (!projectId) return
    const versionsRes = await fetch(`/api/projects/${projectId}/versions`)
    const versionsData = await versionsRes.json()
    setVersions(versionsData.versions ?? [])
  }

  async function createVersion(input: { files: HolyFileMap; prompt?: string; summary?: string; label?: string }) {
    if (!projectId) return
    await fetch(`/api/projects/${projectId}/versions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    await refreshVersions()
  }

  async function handleGenerate() {
    if (!prompt.trim()) return
    setLoading(true)

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    })

    const data = await res.json()
    if (data.files) {
      await syncFiles(data.files)
      await createVersion({ files: data.files, prompt, summary: 'Generated app', label: 'AI Generate' })
    }

    setLoading(false)
  }

  async function handlePatched(nextFiles: HolyFileMap, summary: string, instruction: string) {
    await syncFiles(nextFiles)
    await createVersion({
      files: nextFiles,
      prompt: instruction,
      summary,
      label: 'AI Patch',
    })
  }

  async function handleSaveVersion() {
    if (!projectId) return
    setSaving(true)
    await createVersion({ files, label: 'Manual Save', summary: 'Manual save from Studio' })
    setSaving(false)
  }

  async function handleRestore(versionId: string) {
    if (!projectId) return
    const res = await fetch(`/api/projects/${projectId}/versions/${versionId}/restore`, {
      method: 'POST',
    })
    const data = await res.json()
    if (data.files) {
      setFiles(data.files)
    }
  }

  async function handlePublish() {
    if (!projectId) return
    setPublishing(true)

    const res = await fetch(`/api/projects/${projectId}/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(publishForm),
    })

    const data = await res.json()
    if (data.listing) {
      setProjectStatus('PUBLISHED')
      setPublishedSlug(data.listing.slug)
    }

    setPublishing(false)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A24A]">Holy Studio</p>
          <h1 className="mt-2 text-xl font-bold">{projectName}</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/60">{projectStatus}</span>
          <button
            onClick={handleSaveVersion}
            disabled={saving || !projectId}
            className="rounded-xl border border-white/20 px-4 py-2 text-sm hover:border-[#C9A24A]/60 hover:text-[#C9A24A] disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save Version'}
          </button>
          <button
            onClick={() => setPublishOpen(true)}
            disabled={!projectId}
            className="rounded-xl bg-[#C9A24A] px-4 py-2 text-sm font-bold text-black disabled:opacity-50"
          >
            Publish
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-81px)]">
        <aside className="w-80 space-y-4 overflow-y-auto border-r border-white/10 bg-black/30 p-4">
          <textarea
            className="h-28 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white outline-none focus:border-[#C9A24A]/60"
            placeholder="Describe your app idea..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full rounded-2xl border border-white/20 bg-black/40 px-4 py-3 text-sm font-semibold hover:border-[#C9A24A]/60 hover:text-[#C9A24A] disabled:opacity-50"
          >
            {loading ? 'Generating…' : 'Generate App'}
          </button>

          <ComponentRegistryPanel items={defaultComponentRegistry} selectedId={selectedId} onSelect={setSelected} />
          <VersionTimeline versions={versions} onRestore={handleRestore} />
        </aside>

        <main className="flex-1 overflow-auto p-4">
          <div className="h-full rounded-3xl border border-white/10 bg-white/[0.03] p-2">
            <SandpackPreview files={files} />
          </div>
        </main>

        <ComponentInspector selected={selected} files={files} onPatched={handlePatched} />
      </div>

      {publishOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#111] p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Publish to Holy Store</h2>
              <button onClick={() => setPublishOpen(false)} className="text-white/50 hover:text-white">
                Close
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <input
                value={publishForm.title}
                onChange={(e) => setPublishForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Title"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2"
              />
              <textarea
                value={publishForm.description}
                onChange={(e) => setPublishForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Description"
                className="h-24 w-full resize-none rounded-xl border border-white/10 bg-black/40 px-3 py-2"
              />
              <input
                value={publishForm.category}
                onChange={(e) => setPublishForm((prev) => ({ ...prev, category: e.target.value }))}
                placeholder="Category"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={publishForm.priceType}
                  onChange={(e) => setPublishForm((prev) => ({ ...prev, priceType: e.target.value }))}
                  className="rounded-xl border border-white/10 bg-black/40 px-3 py-2"
                >
                  <option value="FREE">FREE</option>
                  <option value="ONE_TIME">ONE_TIME</option>
                  <option value="SUBSCRIPTION">SUBSCRIPTION</option>
                </select>
                <input
                  type="number"
                  min={0}
                  value={publishForm.priceCents}
                  onChange={(e) => setPublishForm((prev) => ({ ...prev, priceCents: Number(e.target.value) }))}
                  placeholder="Price cents"
                  className="rounded-xl border border-white/10 bg-black/40 px-3 py-2"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              {publishedSlug ? (
                <a href={`/store/${publishedSlug}`} className="text-sm font-semibold text-[#C9A24A] underline">
                  View Listing
                </a>
              ) : (
                <span className="text-sm text-white/40">Ready to publish</span>
              )}

              <button
                onClick={handlePublish}
                disabled={publishing}
                className="rounded-xl bg-[#C9A24A] px-4 py-2 text-sm font-bold text-black disabled:opacity-50"
              >
                {publishing ? 'Publishing…' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
