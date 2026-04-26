import Link from 'next/link'

export function TrustCenterHome() {
  return (
    <section className="rounded-2xl border border-[#C9A24A]/25 bg-black/40 p-6 backdrop-blur">
      <h1 className="text-3xl font-semibold text-white">Holy Trust Center</h1>
      <p className="mt-2 text-sm text-zinc-300">
        Security, compliance, data residency, and reliability transparency for enterprise teams.
      </p>
      <div className="mt-5 flex flex-wrap gap-3 text-sm">
        <Link href="/trust/security" className="rounded-lg border border-[#C9A24A]/40 px-3 py-2 text-[#C9A24A]">Security</Link>
        <Link href="/trust/compliance" className="rounded-lg border border-[#C9A24A]/40 px-3 py-2 text-[#C9A24A]">Compliance</Link>
        <Link href="/trust/data-residency" className="rounded-lg border border-[#C9A24A]/40 px-3 py-2 text-[#C9A24A]">Data residency</Link>
        <Link href="/status" className="rounded-lg border border-[#C9A24A]/40 px-3 py-2 text-[#C9A24A]">Public status</Link>
      </div>
    </section>
  )
}
