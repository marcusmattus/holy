export function CertifiedAgentBadge({ level = 'VERIFIED' }: { level?: 'VERIFIED' | 'TRUSTED' | 'ENTERPRISE_READY' }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#C9A24A]/40 bg-[#C9A24A]/10 px-2 py-1 text-xs text-[#C9A24A]">
      {level.replaceAll('_', ' ')}
    </span>
  )
}
