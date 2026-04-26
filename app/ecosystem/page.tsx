import { EcosystemMap } from '@/features/ecosystem/components/EcosystemMap'

export default function EcosystemPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] px-6 py-8 text-[#F8FAFC]">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-semibold">Ecosystem</h1>
        <p className="mt-2 text-sm text-[#A1A1AA]">
          Agents coordinate, templates scale, and enterprises integrate securely.
        </p>
        <div className="mt-6">
          <EcosystemMap />
        </div>
      </div>
    </main>
  )
}
