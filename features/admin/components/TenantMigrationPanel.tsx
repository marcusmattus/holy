'use client'

import { useState } from 'react'

export function TenantMigrationPanel({ workspaceId }: { workspaceId: string }) {
  const [status, setStatus] = useState('Idle')

  async function runDryMigration() {
    setStatus('Planning...')
    await fetch(`/api/admin/tenants/${workspaceId}/migration-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destinationRegion: 'eu-west-1', strictMode: true }),
    })

    const migrate = await fetch(`/api/admin/tenants/${workspaceId}/migrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destinationRegion: 'eu-west-1', dryRun: true }),
    })

    const data = await migrate.json()
    setStatus(data.migration.status)
  }

  return (
    <div className="rounded-xl border border-[#C9A24A33] bg-[#0A0A0A]/80 p-4">
      <h3 className="text-[#C9A24A] font-semibold">Tenant Migration</h3>
      <button className="mt-3 rounded-md border border-[#C9A24A66] px-3 py-2 text-sm" onClick={runDryMigration}>
        Dry-run migration
      </button>
      <p className="mt-2 text-xs text-[#c4c4c4]">{status}</p>
    </div>
  )
}
