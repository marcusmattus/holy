'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <button onClick={() => setOpen(!open)} className="p-2 rounded-lg hover:bg-muted">
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      {open && (
        <div className="absolute inset-0 z-50 bg-background p-4">
          <div className="flex justify-end mb-4">
            <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-muted">
              <X size={20} />
            </button>
          </div>
          <nav className="space-y-2">
            {['Dashboard', 'Projects', 'Store', 'Analytics', 'Revenue', 'Settings'].map((item) => (
              <Link
                key={item}
                href={`/dashboard/${item === 'Dashboard' ? '' : item.toLowerCase()}`}
                className="block px-4 py-2 rounded-lg hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}
