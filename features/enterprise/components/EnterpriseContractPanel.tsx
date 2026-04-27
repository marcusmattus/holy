import { getEnterpriseContract } from '@/server/services/enterprise-contract.service'

export function EnterpriseContractPanel({ workspaceId }: { workspaceId: string }) {
  const contract = getEnterpriseContract(workspaceId)

  return (
    <section className="rounded-xl border border-[#C9A24A]/30 bg-[#111]/80 p-6 backdrop-blur">
      <h2 className="text-xl font-semibold text-[#F8F2E5]">Enterprise Contract</h2>
      <p className="mt-2 text-sm text-[#D0D0D0]">Workspace {contract.workspaceId} · {contract.status}</p>
      <ul className="mt-4 space-y-1 text-sm text-[#BDBDBD]">
        <li>Uptime target: {contract.uptimeTarget}</li>
        <li>Support level: {contract.supportLevel}</li>
        <li>Response time: {contract.responseTime}</li>
      </ul>
    </section>
  )
}
