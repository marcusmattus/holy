import { EnterpriseOverview } from '@/features/enterprise/components/EnterpriseOverview'
import { AuditLogTable } from '@/features/enterprise/components/AuditLogTable'
import { ApiKeyManager } from '@/features/enterprise/components/ApiKeyManager'
import { SecuritySettingsPanel } from '@/features/enterprise/components/SecuritySettingsPanel'
import { WhiteLabelSettings } from '@/features/enterprise/components/WhiteLabelSettings'

export default function EnterprisePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <header>
        <h1 className="text-3xl font-bold">Enterprise</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage enterprise controls across workspaces, APIs, and white-label deployments.
        </p>
      </header>
      <EnterpriseOverview />
      <ApiKeyManager />
      <SecuritySettingsPanel />
      <WhiteLabelSettings />
      <AuditLogTable />
    </div>
  )
}
