const ITEMS = [
  { label: 'Store Sales', value: '$1,240', period: 'this month' },
  { label: 'Ad Revenue', value: '$380', period: 'this month' },
  { label: 'Subscriptions', value: '$620', period: 'this month' },
  { label: 'Pending Rewards', value: '$423', period: 'claimable' },
]

export function EarningsSummary() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {ITEMS.map(({ label, value, period }) => (
        <div key={label} className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{period}</p>
        </div>
      ))}
    </div>
  )
}
