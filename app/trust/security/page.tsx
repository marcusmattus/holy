import { SecurityControlsList } from '@/features/trust/components/SecurityControlsList'

export default function TrustSecurityPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] p-8 text-white">
      <div className="mx-auto max-w-4xl space-y-4">
        <h1 className="text-3xl text-[#C9A24A]">Security controls</h1>
        <SecurityControlsList />
      </div>
    </main>
  )
}
