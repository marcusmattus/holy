'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Store,
  DollarSign,
  Globe,
  Loader2,
  CheckCircle2,
  Tag,
} from 'lucide-react'

const PRICING_MODELS = [
  { id: 'free', label: 'Free', description: 'Earn through Holy Protocol rewards' },
  { id: 'paid', label: 'Paid', description: 'One-time purchase price' },
  { id: 'subscription', label: 'Subscription', description: 'Recurring monthly fee' },
]

const CATEGORIES = [
  'SaaS Platform', 'E-commerce', 'Landing Page',
  'Dashboard', 'API Tool', 'Portfolio', 'Marketplace', 'Dev Tool',
]

export default function PublishPage({
  params,
}: {
  params: { projectId: string }
}) {
  const router = useRouter()
  const { projectId } = params

  const [pricingModel, setPricingModel] = useState('free')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [shortDesc, setShortDesc] = useState('')
  const [longDesc, setLongDesc] = useState('')
  const [demoUrl, setDemoUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!shortDesc.trim() || !category) {
      setError('Short description and category are required.')
      return
    }
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/store/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          shortDescription: shortDesc.trim(),
          longDescription: longDesc.trim() || undefined,
          demoUrl: demoUrl.trim() || undefined,
          category,
          pricingModel,
          price: pricingModel !== 'free' ? parseFloat(price) || 0 : 0,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to submit')
      }
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-lg space-y-6">
        <div className="rounded-2xl border border-[#10B981]/30 bg-[#10B981]/5 p-8 text-center space-y-4">
          <CheckCircle2 size={48} className="text-[#10B981] mx-auto" />
          <h2 className="text-xl font-bold">Submitted for Review</h2>
          <p className="text-sm text-muted-foreground">
            Your app is now in review. We typically approve listings within 24 hours. You&apos;ll
            earn Holy Protocol rewards for every install once published.
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <Link
              href="/dashboard/store"
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
            >
              Browse Store
            </Link>
            <Link
              href={`/dashboard/projects/${projectId}`}
              className="rounded-lg bg-[#7C3AED] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#6D28D9] transition-colors"
            >
              Back to Project
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href={`/dashboard/projects/${projectId}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to project
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#7C3AED] flex items-center justify-center">
            <Store size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Publish to Holy Store</h1>
            <p className="text-sm text-muted-foreground">
              List your app for the Holy community and earn Protocol rewards
            </p>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <DollarSign size={16} className="text-[#C9A24A]" />
          <h2 className="font-semibold">Pricing Model</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRICING_MODELS.map(({ id, label, description }) => (
            <button
              key={id}
              onClick={() => setPricingModel(id)}
              className={`rounded-xl border p-4 text-left transition-all ${
                pricingModel === id
                  ? 'border-[#7C3AED] bg-[#7C3AED]/10'
                  : 'border-border hover:border-[#7C3AED]/40'
              }`}
            >
              <p className="font-semibold text-sm">{label}</p>
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            </button>
          ))}
        </div>
        {pricingModel !== 'free' && (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {pricingModel === 'paid' ? 'One-time price' : 'Monthly price'} (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="9.99"
                className="w-full rounded-lg border border-border bg-background pl-7 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7C3AED]/50"
              />
            </div>
          </div>
        )}
      </div>

      {/* Listing Details */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Globe size={16} className="text-[#C9A24A]" />
          <h2 className="font-semibold">Listing Details</h2>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Short description <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            maxLength={120}
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            placeholder="One line that sells your app…"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7C3AED]/50"
          />
          <p className="text-xs text-muted-foreground text-right">
            {shortDesc.length}/120
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Full description</label>
          <textarea
            value={longDesc}
            onChange={(e) => setLongDesc(e.target.value)}
            placeholder="Describe features, use cases, tech stack…"
            rows={5}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7C3AED]/50 resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Demo URL</label>
          <input
            type="url"
            value={demoUrl}
            onChange={(e) => setDemoUrl(e.target.value)}
            placeholder="https://your-demo.vercel.app"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7C3AED]/50"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Tag size={14} />
            <label className="text-sm font-medium">
              Category <span className="text-destructive">*</span>
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
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
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => router.back()}
          className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#7C3AED] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Submitting…
            </>
          ) : (
            <>
              <Store size={14} />
              Submit for Review
            </>
          )}
        </button>
      </div>
    </div>
  )
}
