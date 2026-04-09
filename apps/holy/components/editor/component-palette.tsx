'use client'

const COMPONENTS = [
  { category: 'Layout', items: ['Hero', 'Navbar', 'Footer', 'Sidebar'] },
  { category: 'Data', items: ['Table', 'Chart', 'Stats Card', 'Timeline'] },
  { category: 'Forms', items: ['Login', 'Sign Up', 'Contact', 'Newsletter'] },
  { category: 'Marketing', items: ['Pricing', 'Features', 'Testimonials', 'CTA'] },
]

export function ComponentPalette() {
  return (
    <div className="w-48 flex-shrink-0 border-r border-border bg-card overflow-y-auto">
      <div className="p-3 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        Components
      </div>
      {COMPONENTS.map(({ category, items }) => (
        <div key={category}>
          <div className="px-3 py-2 text-xs font-medium text-muted-foreground">{category}</div>
          {items.map((item) => (
            <button
              key={item}
              className="w-full text-left px-3 py-1.5 text-xs hover:bg-muted transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}
