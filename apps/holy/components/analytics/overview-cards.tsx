const CARDS = [
  { label: 'Total Views', value: '48,291', change: '+12%', positive: true },
  { label: 'Unique Visitors', value: '18,430', change: '+8%', positive: true },
  { label: 'Revenue', value: '$2,840', change: '+23%', positive: true },
  { label: 'Active Projects', value: '4', change: '0', positive: true },
]

export function OverviewCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {CARDS.map(({ label, value, change, positive }) => (
        <div
          key={label}
          className="rounded-xl border border-border bg-card p-5"
        >
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <p
            className={`text-xs mt-1 font-medium ${positive ? 'text-[#10B981]' : 'text-destructive'}`}
          >
            {change} vs last month
          </p>
        </div>
      ))}
    </div>
  )
}
