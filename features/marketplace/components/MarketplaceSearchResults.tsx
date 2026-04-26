import { CertifiedAgentBadge } from '@/features/marketplace/components/CertifiedAgentBadge'

const items = [
  { id: '1', title: 'Enterprise Risk Agent', type: 'Agent', certified: true },
  { id: '2', title: 'SOC2 Review Workflow', type: 'Workflow', certified: false },
]

export function MarketplaceSearchResults() {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="rounded-2xl border border-[#2A2A2A] bg-[#121212] p-4 text-sm text-white">
          <p className="font-medium">{item.title}</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-[#BEBEBE]">
            <span>{item.type}</span>
            {item.certified ? <CertifiedAgentBadge /> : null}
          </div>
        </div>
      ))}
    </div>
  )
}
