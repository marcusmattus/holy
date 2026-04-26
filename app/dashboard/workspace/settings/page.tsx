import { AuditLogTable } from '@/features/enterprise/components/AuditLogTable'
import { ApiKeyManager } from '@/features/enterprise/components/ApiKeyManager'
import { SecuritySettingsPanel } from '@/features/enterprise/components/SecuritySettingsPanel'
import { WhiteLabelSettings } from '@/features/enterprise/components/WhiteLabelSettings'

export default function WorkspaceSettingsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Workspace Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enterprise-ready controls for audit, API access, and branding.
        </p>
      </div>
      <ApiKeyManager />
      <SecuritySettingsPanel />
      <WhiteLabelSettings />
      <AuditLogTable />
    </div>
  )
}
