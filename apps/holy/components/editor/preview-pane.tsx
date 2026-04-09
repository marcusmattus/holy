'use client'

export function PreviewPane() {
  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-[#0A0A0F]">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-card">
        <span className="text-xs text-muted-foreground">Preview</span>
        <div className="flex-1" />
        <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
          {['Mobile', 'Tablet', 'Desktop'].map((size) => (
            <button
              key={size}
              className={`px-2 py-0.5 rounded text-xs ${size === 'Desktop' ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 flex items-start justify-center p-8 overflow-auto">
        <div className="w-full max-w-2xl rounded-xl border border-border overflow-hidden shadow-xl">
          <div className="py-24 px-4 text-center bg-gradient-to-b from-[#7C3AED]/20 to-transparent">
            <h1 className="text-5xl font-bold mb-4 text-foreground">Build the future</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
              Powered by Holy — the vibecoding platform.
            </p>
            <div className="flex gap-3 max-w-sm mx-auto">
              <input
                type="email"
                placeholder="you@example.com"
                className="flex-1 rounded-lg border border-border px-3 py-2 text-sm bg-background"
                readOnly
              />
              <button className="rounded-lg bg-[#7C3AED] px-4 py-2 text-sm font-semibold text-white">
                Get started
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
