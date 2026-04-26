import { ComplianceReadinessDashboard } from '@/features/compliance/components/ComplianceReadinessDashboard'

export const metadata = { title: 'Compliance Readiness — Holy' }

export default function ComplianceReadinessPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] p-8" style={{ fontFamily: 'Space Grotesk, var(--font-geist-sans)' }}>
      <div className="mx-auto max-w-5xl">
        <ComplianceReadinessDashboard />
      </div>
    </main>
  )
}
