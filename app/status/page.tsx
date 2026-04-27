import { PublicStatusPage } from '@/features/status/components/PublicStatusPage'
import { listPublicStatus } from '@/server/services/public-status.service'

export default function StatusPage() {
  const { components, incidents } = listPublicStatus()
  return (
    <main className="min-h-screen bg-[#0A0A0A] p-8 text-white">
      <div className="mx-auto max-w-6xl space-y-5">
        <h1 className="text-3xl text-[#C9A24A]">Holy Platform Status</h1>
        <p className="text-sm text-zinc-400">Public-safe summaries only. Sensitive incident details remain internal unless approved.</p>
        <PublicStatusPage components={components} incidents={incidents} />
      </div>
    </main>
  )
}
