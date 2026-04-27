import { getSettlementRolloutPolicy } from '@/server/services/settlement-rollout.service'

export function SettlementRolloutDashboard() {
  const policy = getSettlementRolloutPolicy('workspace-demo')

  return (
    <section className="rounded-xl border border-[#C9A24A]/30 bg-[#111]/80 p-6 backdrop-blur">
      <h2 className="text-xl font-semibold text-[#F8F2E5]">Settlement Pilot Rollout</h2>
      <p className="mt-2 text-sm text-[#D0D0D0]">Provider: {policy?.approvedProvider} · Dry run: {String(policy?.dryRun)}</p>
      <p className="mt-1 text-xs text-[#C9A24A]">Emergency disable: {String(policy?.emergencyDisabled)}</p>
    </section>
  )
}
