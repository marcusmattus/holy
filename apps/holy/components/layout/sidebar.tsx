'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FolderOpen,
  Store,
  BarChart2,
  DollarSign,
  Settings,
  Wand2,
  Coins,
} from 'lucide-react'

const NAV_SECTIONS = [
  {
    label: 'Workspace',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/dashboard/studio', label: 'Holy Studio', icon: Wand2, accent: true },
      { href: '/dashboard/projects', label: 'Projects', icon: FolderOpen },
    ],
  },
  {
    label: 'Distribute',
    items: [
      { href: '/dashboard/store', label: 'Store', icon: Store },
    ],
  },
  {
    label: 'Monetize',
    items: [
      { href: '/dashboard/revenue', label: 'Revenue', icon: DollarSign },
      { href: '/dashboard/revenue/rewards', label: 'Rewards', icon: Coins },
      { href: '/dashboard/analytics', label: 'Insights', icon: BarChart2 },
    ],
  },
  {
    label: 'Account',
    items: [
      { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/dashboard'
      ? pathname === href
      : pathname === href || pathname.startsWith(href + '/')

  return (
    <aside className="w-56 flex-shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#7C3AED] flex items-center justify-center text-white font-bold text-xs">
            H
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-sm">Holy</span>
            <span className="text-[10px] text-muted-foreground tracking-widest uppercase">
              by Holystic
            </span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-5 overflow-y-auto">
        {NAV_SECTIONS.map(({ label, items }) => (
          <div key={label} className="space-y-1">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-1">
              {label}
            </p>
            {items.map(({ href, label: itemLabel, icon: Icon, accent }) => {
              const active = isActive(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-[#7C3AED]/20 text-[#7C3AED]'
                      : accent
                        ? 'text-[#C9A24A] hover:bg-[#C9A24A]/10'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  }`}
                >
                  <Icon size={15} />
                  {itemLabel}
                  {accent && !active && (
                    <span className="ml-auto text-[9px] font-bold uppercase tracking-widest bg-[#C9A24A]/20 text-[#C9A24A] px-1.5 py-0.5 rounded-full">
                      AI
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-sidebar-accent cursor-pointer transition-colors">
          <div className="w-6 h-6 rounded-full bg-[#7C3AED]/30 flex items-center justify-center text-xs font-bold text-[#7C3AED] flex-shrink-0">
            B
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate">builder</p>
            <p className="text-[10px] text-muted-foreground truncate">Free plan</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
