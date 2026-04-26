import { getAutonomyPolicy } from '@/server/services/autonomy-policy.service'

export function AutonomyPolicyPanel({ workspaceId }: { workspaceId: string }) {
  const policy = getAutonomyPolicy(workspaceId)

  return (
    <section className="rounded-xl border border-[#C9A24A]/30 bg-[#111]/80 p-6 backdrop-blur">
      <h2 className="text-xl font-semibold text-[#F8F2E5]">Autonomy Policy</h2>
      <p className="mt-2 text-sm text-[#D0D0D0]">Auto-apply allowed: {String(policy.autoApplyAllowed)}</p>
      <p className="mt-2 text-xs text-[#C9A24A]">Approval gates: {policy.requiresApprovalFor.join(', ')}</p>
    </section>
  )
}
