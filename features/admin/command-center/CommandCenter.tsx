import { RuntimeOpsPanel } from '@/features/admin/command-center/RuntimeOpsPanel'
import { WorkerOpsPanel } from '@/features/admin/command-center/WorkerOpsPanel'
import { IncidentOpsPanel } from '@/features/admin/command-center/IncidentOpsPanel'
import { AutonomyOpsPanel } from '@/features/admin/command-center/AutonomyOpsPanel'
import { SettlementOpsPanel } from '@/features/admin/command-center/SettlementOpsPanel'
import { ComplianceOpsPanel } from '@/features/admin/command-center/ComplianceOpsPanel'

export function CommandCenter() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <RuntimeOpsPanel />
      <WorkerOpsPanel />
      <IncidentOpsPanel />
      <AutonomyOpsPanel />
      <SettlementOpsPanel />
      <ComplianceOpsPanel />
    </div>
  )
}
