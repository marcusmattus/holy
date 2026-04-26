'use client'

import { useEffect, useState } from 'react'
import TemplateDetail from '@/features/templates/components/TemplateDetail'

type TemplateResponse = {
  template?: {
    id: string
    title: string
    description: string
    category?: string | null
    priceType: 'FREE' | 'ONE_TIME' | 'SUBSCRIPTION'
    priceCents: number
    creator?: { email?: string }
    forks?: { id: string }[]
  }
}

export default function TemplateDetailContainer({ slug }: { slug: string }) {
  const [data, setData] = useState<TemplateResponse['template']>()

  useEffect(() => {
    async function loadTemplate() {
      const response = await fetch(`/api/templates/${slug}`)
      if (!response.ok) return
      const payload = (await response.json()) as TemplateResponse
      setData(payload.template)
    }

    loadTemplate()
  }, [slug])

  if (!data) {
    return <p className="text-sm text-white/70">Loading template...</p>
  }

  const priceLabel =
    data.priceType === 'FREE' ? 'Free' : `£${(data.priceCents / 100).toFixed(2)}`

  return (
    <TemplateDetail
      templateId={data.id}
      title={data.title}
      description={data.description}
      category={data.category}
      creator={data.creator?.email}
      priceLabel={priceLabel}
      forks={data.forks?.length ?? 0}
    />
  )
}
