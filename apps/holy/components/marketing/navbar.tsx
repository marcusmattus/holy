import Link from 'next/link'

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#27272A]/80 bg-[#0A0A0F]/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#7C3AED] flex items-center justify-center text-white font-bold text-xs">
            H
          </div>
          <span className="font-semibold text-sm">Holy</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm text-[#A1A1AA]">
          <Link href="/pricing" className="hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="#features" className="hover:text-white transition-colors">
            Features
          </Link>
          <Link
            href="#ecosystem"
            className="hover:text-white transition-colors"
          >
            Ecosystem
          </Link>
          <Link
            href="https://docs.holysticlabs.com"
            className="hover:text-white transition-colors"
          >
            Docs
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="px-3 py-1.5 text-sm text-[#A1A1AA] hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="px-4 py-1.5 rounded-lg bg-[#7C3AED] text-sm font-semibold text-white hover:bg-[#6D28D9] transition-colors"
          >
            Get started →
          </Link>
        </div>
      </div>
    </nav>
  )
}
