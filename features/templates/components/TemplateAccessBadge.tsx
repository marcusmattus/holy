"use client"

export default function TemplateAccessBadge({
  paid,
  hasAccess,
  subscriberOnly,
}: {
  paid: boolean
  hasAccess: boolean
  subscriberOnly?: boolean
}) {
  const label = hasAccess ? 'ACCESS GRANTED' : paid ? 'PAID TEMPLATE' : 'FREE TEMPLATE'
  return (
    <span className="inline-flex rounded-full border border-[#C9A24A]/40 bg-[#C9A24A]/10 px-2 py-1 text-[11px] font-medium text-[#C9A24A]">
      {label}
      {subscriberOnly ? ' · SUBSCRIBER ONLY' : ''}
    </span>
  )
}
