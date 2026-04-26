import { TransparencyReport } from '@/features/trust/components/TransparencyReport'
import { generateTransparencyReport } from '@/server/services/transparency-report.service'

export default function TransparencyPage() {
  const report = generateTransparencyReport(false)
  return (
    <main className="min-h-screen bg-[#0A0A0A] p-8 text-white">
      <div className="mx-auto max-w-6xl space-y-4">
        <h1 className="text-3xl text-[#C9A24A]">Ecosystem transparency report</h1>
        <p className="text-sm text-zinc-400">Aggregate metrics only. No private customer data is published.</p>
        <TransparencyReport report={report} />
      </div>
    </main>
  )
}
