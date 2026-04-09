'use client'

import { usePathname } from 'next/navigation'

const TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/projects': 'Projects',
  '/dashboard/store': 'Store',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/revenue': 'Revenue',
  '/dashboard/settings': 'Settings',
}

export function Topbar() {
  const pathname = usePathname()
  const title = TITLES[pathname] ?? 'Holy'

  return (
    <header className="h-14 border-b border-border bg-background/80 backdrop-blur flex items-center px-6 gap-4 flex-shrink-0">
      <h2 className="font-semibold text-sm">{title}</h2>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground px-2 py-1 rounded-full bg-[#10B981]/20 text-[#10B981] font-medium">
          ✦ HolyOS Connected
        </span>
      </div>
    </header>
  )
}
