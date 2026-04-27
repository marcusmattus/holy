import { ComplianceStatusCard } from '@/features/trust/components/ComplianceStatusCard'

const frameworks = [
  { name: 'SOC 2 Type II', status: 'In progress' },
  { name: 'ISO 27001', status: 'Readiness plan active' },
  { name: 'GDPR Controls', status: 'Implemented with regional policies' },
]

export default function TrustCompliancePage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] p-8 text-white">
      <div className="mx-auto max-w-4xl space-y-4">
        <h1 className="text-3xl text-[#C9A24A]">Compliance</h1>
        <div className="grid gap-3 sm:grid-cols-2">
          {frameworks.map((framework) => (
            <ComplianceStatusCard key={framework.name} {...framework} />
          ))}
        </div>
        <p className="text-xs text-zinc-500">Private audit evidence is not publicly displayed.</p>
      </div>
    </main>
  )
}
