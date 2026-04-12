import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative pt-32 pb-24 px-4 overflow-hidden">
      {/* Gradient blobs */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#7C3AED]/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-40 left-1/4 w-[300px] h-[300px] rounded-full bg-[#2563EB]/15 blur-[80px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#7C3AED]/40 bg-[#7C3AED]/10 text-[#7C3AED] text-xs font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
          Powered by HolyOS from Holystic Labs
        </div>

        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
          Build web apps
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#2563EB] to-[#10B981]">
            by vibing.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-[#A1A1AA] max-w-2xl mx-auto mb-10 leading-relaxed">
          Holy is the vibecoding platform where you build, publish, and monetize
          web apps using AI. Powered by HolyOS — the operating system for the
          next generation of builders.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#7C3AED] text-white font-semibold text-sm hover:bg-[#6D28D9] transition-colors shadow-lg shadow-[#7C3AED]/25"
          >
            Start building free →
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-[#27272A] text-[#F8FAFC] font-semibold text-sm hover:bg-[#18181B] transition-colors"
          >
            View demo
          </Link>
        </div>

        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-[#A1A1AA]">
          <span>✓ Free to start</span>
          <span>✓ No credit card</span>
          <span>✓ Built for creators</span>
        </div>
      </div>
    </section>
  )
}
