'use client'

import { useEffect, useState } from 'react'
import TemplateCard from './TemplateCard'

type Template = {
  id: string
  slug: string
  title: string
  description: string
  category?: string | null
  priceType: 'FREE' | 'ONE_TIME' | 'SUBSCRIPTION'
  priceCents: number
  creator?: { email?: string }
  forks?: { id: string }[]
}

export default function TemplateGrid() {
  const [templates, setTemplates] = useState<Template[]>([])

  useEffect(() => {
    async function loadTemplates() {
      const response = await fetch('/api/templates')
      if (!response.ok) return
      const data = (await response.json()) as { templates?: Template[] }
      setTemplates(data.templates ?? [])
    }

    loadTemplates()
  }, [])

  if (templates.length === 0) {
    return <p className="text-sm text-white/70">No templates published yet.</p>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  )
}
