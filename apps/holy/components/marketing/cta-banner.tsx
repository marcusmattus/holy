import Link from 'next/link'

export function CTABanner() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto rounded-2xl bg-gradient-to-br from-[#7C3AED] via-[#4F46E5] to-[#2563EB] p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
        <div className="relative">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to start vibing?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Join thousands of builders already using Holy to create, deploy, and monetize their apps.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-[#7C3AED] font-semibold text-sm hover:bg-white/90 transition-colors"
            >
              Get started free →
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              View pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
