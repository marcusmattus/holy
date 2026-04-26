export function MarketplaceFilters() {
  return (
    <div className="rounded-2xl border border-[#2A2A2A] bg-[#111111]/70 p-4 text-sm text-[#D8D8D8]">
      <p className="text-[#C9A24A] font-medium">Filters</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {['Apps', 'Templates', 'Agents', 'Workflows', 'Creators', 'Integrations'].map((label) => (
          <span key={label} className="rounded-full border border-[#333] px-3 py-1">
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
