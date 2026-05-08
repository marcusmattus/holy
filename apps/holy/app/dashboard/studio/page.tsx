'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Sparkles,
  Wand2,
  LayoutTemplate,
  ShoppingBag,
  BarChart3,
  Globe,
  Zap,
  ArrowRight,
  Loader2,
  Code2,
  Eye,
} from 'lucide-react'

const TEMPLATES = [
  {
    id: 'saas-dashboard',
    label: 'SaaS Dashboard',
    icon: LayoutTemplate,
    prompt:
      'A modern SaaS analytics dashboard with sidebar navigation, KPI cards, a line chart for monthly revenue, a user growth bar chart, and a recent activity feed. Dark theme with gold accents.',
  },
  {
    id: 'ecommerce',
    label: 'E-commerce',
    icon: ShoppingBag,
    prompt:
      'A clean e-commerce product listing page with a filter sidebar, product cards with images, prices, ratings, and an add-to-cart button. Minimal white design with bold typography.',
  },
  {
    id: 'landing-page',
    label: 'Launch Page',
    icon: Globe,
    prompt:
      'A high-converting SaaS landing page with a hero section featuring a gradient headline, feature grid with icons, social proof testimonials, pricing cards, and a CTA footer.',
  },
  {
    id: 'analytics',
    label: 'Analytics Tool',
    icon: BarChart3,
    prompt:
      'A web analytics dashboard with realtime visitor counter, traffic source breakdown donut chart, top pages table, device breakdown, and geographic heatmap placeholder.',
  },
  {
    id: 'api-tool',
    label: 'API Explorer',
    icon: Zap,
    prompt:
      'A developer API explorer with a left-side endpoint list, request builder with method selector and URL input, headers and body editors, and a response panel with syntax highlighting.',
  },
]

type GenerateState = 'idle' | 'generating' | 'done' | 'error'

export default function StudioPage() {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [appName, setAppName] = useState('')
  const [state, setState] = useState<GenerateState>('idle')
  const [generatedCode, setGeneratedCode] = useState('')
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code')
  const [saving, setSaving] = useState(false)
  const streamRef = useRef<string>('')

  const handleTemplate = (templatePrompt: string) => {
    setPrompt(templatePrompt)
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setState('generating')
    setGeneratedCode('')
    streamRef.current = ''

    try {
      const res = await fetch('/api/studio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      if (!res.ok) throw new Error('Generation failed')
      if (!res.body) throw new Error('No stream body')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        streamRef.current += chunk
        setGeneratedCode(streamRef.current)
      }

      setState('done')
    } catch (err) {
      console.error(err)
      setState('error')
    }
  }

  const handleSaveAsProject = async () => {
    if (!generatedCode || !appName.trim()) return
    setSaving(true)

    const slug = appName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + Date.now()

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: appName,
          slug,
          description: prompt.slice(0, 200),
          userId: 'dev-user', // replaced by real auth
          holyosProjectId: `studio_${slug}`,
        }),
      })

      if (!res.ok) throw new Error('Failed to save')
      const { project } = await res.json()

      // Save initial version snapshot
      await fetch(`/api/projects/${project.id}/versions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          snapshot: generatedCode,
          label: 'v1 — AI generated',
        }),
      })

      router.push(`/dashboard/projects/${project.id}/editor`)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8 relative">
      <div className="ethereal-bg" />
      <div className="grain" />

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#7C3AED] flex items-center justify-center">
            <Wand2 size={16} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Holy Studio</h1>
        </div>
        <p className="text-muted-foreground">
          Describe your app. Holy AI generates a production-ready Next.js component in seconds.
        </p>
      </div>

      {/* Template Chips */}
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
          Start from a template
        </p>
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map(({ id, label, icon: Icon, prompt: tpl }) => (
            <button
              key={id}
              onClick={() => handleTemplate(tpl)}
              className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium hover:border-[#7C3AED] hover:text-[#7C3AED] hover:bg-[#7C3AED]/5 transition-all"
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt Input */}
      <div className="rounded-2xl border border-border bg-card p-1 space-y-0 shadow-lg">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the app you want to build... e.g. 'A SaaS dashboard with dark theme, sidebar nav, KPI cards, and a revenue line chart'"
          rows={5}
          className="w-full rounded-xl bg-transparent px-4 py-3 text-sm outline-none resize-none placeholder:text-muted-foreground/50"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate()
          }}
        />
        <div className="flex items-center justify-between px-3 pb-2">
          <span className="text-xs text-muted-foreground">
            ⌘↵ to generate
          </span>
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || state === 'generating'}
            className="flex items-center gap-2 rounded-xl bg-[#7C3AED] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {state === 'generating' ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles size={14} />
                Generate App
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output Panel */}
      {(state === 'generating' || state === 'done') && (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {/* Tab bar */}
          <div className="flex items-center gap-0 border-b border-border px-4">
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'code'
                  ? 'border-[#7C3AED] text-[#7C3AED]'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Code2 size={14} />
              Code
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'preview'
                  ? 'border-[#7C3AED] text-[#7C3AED]'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Eye size={14} />
              Preview
            </button>
            <div className="flex-1" />
            {state === 'generating' && (
              <div className="flex items-center gap-1.5 text-xs text-[#C9A24A]">
                <Loader2 size={12} className="animate-spin" />
                Streaming…
              </div>
            )}
            {state === 'done' && (
              <span className="text-xs text-[#10B981] font-medium">
                ✦ Ready
              </span>
            )}
          </div>

          {/* Code output */}
          {activeTab === 'code' && (
            <pre className="p-4 text-xs font-mono text-foreground/90 overflow-x-auto max-h-96 overflow-y-auto leading-relaxed whitespace-pre-wrap">
              {generatedCode || (
                <span className="text-muted-foreground/40">
                  Generating your component…
                </span>
              )}
            </pre>
          )}

          {/* Live preview placeholder */}
          {activeTab === 'preview' && (
            <div className="p-6 flex items-center justify-center min-h-48 text-muted-foreground text-sm">
              <div className="text-center space-y-2">
                <Eye size={32} className="mx-auto opacity-20" />
                <p>Save as project to open the live editor preview</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Save as Project */}
      {state === 'done' && (
        <div className="rounded-2xl border border-[#7C3AED]/30 bg-[#7C3AED]/5 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1 space-y-1">
            <p className="text-sm font-semibold">Save as a project</p>
            <p className="text-xs text-muted-foreground">
              Opens the editor where you can refine, preview, and publish
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              placeholder="Name your app…"
              className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7C3AED]/50 w-48"
            />
            <button
              onClick={handleSaveAsProject}
              disabled={!appName.trim() || saving}
              className="flex items-center gap-2 rounded-xl bg-[#7C3AED] px-5 py-2 text-sm font-semibold text-white hover:bg-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <ArrowRight size={14} />
              )}
              Open in Editor
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
