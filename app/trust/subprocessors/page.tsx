import { SubprocessorTable } from '@/features/trust/components/SubprocessorTable'

export default function TrustSubprocessorsPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] p-8 text-white">
      <div className="mx-auto max-w-5xl space-y-4">
        <h1 className="text-3xl text-[#C9A24A]">Subprocessors</h1>
        <SubprocessorTable />
      </div>
    </main>
  )
}
