import Link from 'next/link'

export interface AppCardProps {
  id: string
  slug?: string
  name: string
  description: string
  author: string
  price: number
  rating: number
  downloads: number
  category: string
}

export function AppCard({
  id,
  slug,
  name,
  description,
  author,
  price,
  rating,
  downloads,
  category,
}: AppCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3 hover:border-[#7C3AED]/50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-lg bg-[#7C3AED]/20 flex items-center justify-center text-lg font-bold text-[#7C3AED]">
          {name[0]}
        </div>
        <span className="text-xs text-muted-foreground border border-border px-2 py-0.5 rounded-full">
          {category}
        </span>
      </div>
      <div>
        <h3 className="font-semibold">{name}</h3>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {description}
        </p>
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span>by {author}</span>
        <span>⭐ {rating}</span>
        <span>{downloads.toLocaleString()} installs</span>
      </div>
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
        <span className="font-semibold">
          {price === 0 ? 'Free' : `$${price}`}
        </span>
        <Link
          href={slug ? `/store/${slug}` : `/dashboard/store/${id}`}
          className="rounded-lg bg-[#7C3AED] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#6D28D9] transition-colors"
        >
          View
        </Link>
      </div>
    </div>
  )
}
