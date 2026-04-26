import { collectAccessControlEvidence } from '@/server/compliance/evidence-collectors/access-control.collector'
import { collectAuditLogEvidence } from '@/server/compliance/evidence-collectors/audit-log.collector'
import { collectIncidentResponseEvidence } from '@/server/compliance/evidence-collectors/incident-response.collector'
import { collectChangeManagementEvidence } from '@/server/compliance/evidence-collectors/change-management.collector'

export async function runComplianceEvidenceAutomation() {
  return [
    await collectAccessControlEvidence(),
    await collectAuditLogEvidence(),
    await collectIncidentResponseEvidence(),
    await collectChangeManagementEvidence(),
  ]
}
