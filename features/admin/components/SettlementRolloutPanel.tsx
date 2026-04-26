import { getSettlementRolloutPolicy } from '@/server/services/settlement-rollout.service'

export function SettlementRolloutPanel() {
  const policy = getSettlementRolloutPolicy('workspace-demo')

  return (
    <section className="rounded-xl border border-[#C9A24A]/30 bg-[#111]/80 p-5 backdrop-blur">
      <h3 className="text-lg font-medium text-[#F8F2E5]">Settlement Rollout</h3>
      <p className="mt-2 text-xs text-[#BEBEBE]">Enabled: {String(policy?.enabled)} · Emergency: {String(policy?.emergencyDisabled)}</p>
    </section>
  )
}
