'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground">
      {segments.map((seg, i) => {
        const href = '/' + segments.slice(0, i + 1).join('/')
        const isLast = i === segments.length - 1
        return (
          <span key={href} className="flex items-center gap-1">
            {i > 0 && <span>/</span>}
            {isLast ? (
              <span className="text-foreground capitalize">{seg}</span>
            ) : (
              <Link href={href} className="hover:text-foreground capitalize">
                {seg}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
