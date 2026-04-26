import { AgentCertificationQueue } from '@/features/admin/components/AgentCertificationQueue'
import { ComplianceAuditTimeline } from '@/features/admin/compliance/ComplianceAuditTimeline'
import { ComplianceReviewDetail } from '@/features/admin/compliance/ComplianceReviewDetail'
import { ComplianceRiskMatrix } from '@/features/admin/compliance/ComplianceRiskMatrix'

export function ComplianceDashboard() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <ComplianceRiskMatrix />
        <ComplianceReviewDetail />
      </div>
      <ComplianceAuditTimeline />
      <AgentCertificationQueue />
    </div>
  )
}
