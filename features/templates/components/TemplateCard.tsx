import Link from 'next/link'

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

export default function TemplateCard({ template }: { template: Template }) {
  const priceLabel =
    template.priceType === 'FREE' ? 'Free' : `£${(template.priceCents / 100).toFixed(2)}`

  return (
    <article className="rounded-xl border border-[#C9A24A]/30 bg-white/5 p-4 backdrop-blur">
      <p className="text-[10px] uppercase tracking-wider text-[#C9A24A]">{template.category ?? 'General'}</p>
      <h3 className="mt-2 text-lg font-semibold">{template.title}</h3>
      <p className="mt-2 text-sm text-white/70 line-clamp-2">{template.description}</p>
      <div className="mt-4 flex items-center justify-between text-xs text-white/70">
        <span>{template.forks?.length ?? 0} forks</span>
        <span>{priceLabel}</span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-white/60">by {template.creator?.email ?? 'Creator'}</span>
        <Link href={`/templates/${template.slug}`} className="text-sm text-[#C9A24A] hover:underline">
          Use Template
        </Link>
      </div>
    </article>
  )
}
