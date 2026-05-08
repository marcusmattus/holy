'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, Loader2, ArrowLeft, Wand2 } from 'lucide-react'

const CATEGORIES = [
  'SaaS Platform',
  'E-commerce',
  'Landing Page',
  'Dashboard',
  'API Tool',
  'Portfolio',
  'Marketplace',
  'Other',
]

export default function NewProjectPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('Project name is required')
      return
    }
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug + '-' + Date.now(),
          description: description.trim() || undefined,
          category: category || undefined,
          userId: 'dev-user', // replaced by real auth session
          holyosProjectId: `holy_${slug}_${Date.now()}`,
        }),
      })

      if (res.status === 409) {
        setError('A project with that name already exists. Try a different name.')
        return
      }
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create project')
      }

      const { project } = await res.json()
      router.push(`/dashboard/projects/${project.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl space-y-6 relative">
      <div className="ethereal-bg" />

      <div>
        <Link
          href="/dashboard/projects"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to projects
        </Link>
        <h1 className="text-2xl font-bold">New Project</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Create a project, then open it in the editor to build with Holy AI.
        </p>
      </div>

      {/* Studio shortcut */}
      <div className="rounded-xl border border-[#7C3AED]/30 bg-[#7C3AED]/5 p-4 flex items-center gap-4">
        <div className="w-9 h-9 rounded-xl bg-[#7C3AED] flex items-center justify-center flex-shrink-0">
          <Wand2 size={16} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">Want to generate first?</p>
          <p className="text-xs text-muted-foreground">
            Use Holy Studio to describe your app and generate the code automatically.
          </p>
        </div>
        <Link
          href="/dashboard/studio"
          className="flex-shrink-0 rounded-lg bg-[#7C3AED] px-4 py-2 text-xs font-semibold text-white hover:bg-[#6D28D9] transition-colors"
        >
          Open Studio
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        {/* Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Project name <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError('')
            }}
            placeholder="My Holy App"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7C3AED]/50 transition-all"
          />
          {slug && (
            <p className="text-xs text-muted-foreground">
              Slug: <span className="font-mono">{slug}</span>
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does your app do?"
            rows={3}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7C3AED]/50 resize-none transition-all"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat === category ? '' : cat)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-all ${
                  category === cat
                    ? 'bg-[#7C3AED] border-[#7C3AED] text-white'
                    : 'border-border hover:border-[#7C3AED]/50 hover:text-[#7C3AED]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => router.push('/dashboard/projects')}
            className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading || !name.trim()}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#7C3AED] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Creating…
              </>
            ) : (
              <>
                <Sparkles size={14} />
                Create Project
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
