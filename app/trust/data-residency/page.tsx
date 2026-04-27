export default function TrustDataResidencyPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] p-8 text-white">
      <div className="mx-auto max-w-4xl rounded-2xl border border-[#C9A24A]/25 bg-black/40 p-6">
        <h1 className="text-3xl text-[#C9A24A]">Data residency</h1>
        <p className="mt-3 text-sm text-zinc-300">Available regions: US East, US West, EU Central, AP Southeast.</p>
        <p className="mt-2 text-sm text-zinc-300">
          Cross-region migration requires dry-run, admin approval, enterprise owner approval in strict mode, and rollback planning.
        </p>
      </div>
    </main>
  )
}
