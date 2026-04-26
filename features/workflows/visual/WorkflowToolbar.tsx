'use client'

const NODE_TYPES = [
  'RUN_AGENT',
  'APPROVAL_GATE',
  'RUN_QA',
  'APPLY_PATCH',
  'DEPLOY_PREVIEW',
  'DEPLOY_PRODUCTION',
  'UPDATE_LISTING',
  'SEND_NOTIFICATION',
  'WEBHOOK_CALL',
]

export function WorkflowToolbar() {
  return (
    <div className="rounded-xl border border-[#2A2A2A] bg-[#0F0F0F]/80 p-3 backdrop-blur">
      <p className="text-xs font-medium tracking-wide text-[#C9A24A]">NODE PALETTE</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {NODE_TYPES.map((type) => (
          <span key={type} className="rounded border border-[#2A2A2A] px-2 py-1 text-xs text-[#A1A1AA]">
            {type}
          </span>
        ))}
      </div>
    </div>
  )
}
