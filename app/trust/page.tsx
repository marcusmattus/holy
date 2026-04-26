import { TrustCenterHome } from '@/features/trust/components/TrustCenterHome'

export default function TrustPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] p-8 text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        <TrustCenterHome />
        <section className="rounded-2xl border border-[#C9A24A]/20 bg-black/30 p-6">
          <h2 className="text-xl text-[#C9A24A]">Enterprise controls summary</h2>
          <p className="mt-2 text-sm text-zinc-300">
            High-risk routing, migration, settlement, payout, and data-export actions remain approval-gated.
          </p>
          <p className="mt-2 text-xs text-zinc-500">Responsible disclosure: security@holysticlabs.com</p>
        </section>
      </div>
    </main>
  )
}
