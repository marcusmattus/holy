import { ComplianceDashboard } from '@/features/admin/compliance/ComplianceDashboard'
import { ObservabilityDashboard } from '@/features/admin/components/ObservabilityDashboard'

export default function AdminComplianceDashboardPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] p-6 text-white">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold">Compliance Operations</h1>
        <ComplianceDashboard />
        <ObservabilityDashboard />
      </div>
    </main>
  )
}
