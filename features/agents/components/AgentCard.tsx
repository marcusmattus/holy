import Link from 'next/link'

type AgentCardProps = {
  id: string
  slug: string
  title: string
  description: string
  category: string
  priceLabel: string
}

export function AgentCard({
  slug,
  title,
  description,
  category,
  priceLabel,
}: AgentCardProps) {
  return (
    <Link
      href={`/agents/${slug}`}
      className="block rounded-xl border border-[#C9A24A]/25 bg-[#0A0A0A]/80 p-4 backdrop-blur-sm"
    >
      <p className="text-xs uppercase tracking-wide text-[#C9A24A]">{category}</p>
      <h3 className="mt-1 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <p className="mt-3 text-sm text-[#C9A24A]">{priceLabel}</p>
    </Link>
  )
}
