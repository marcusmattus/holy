import { OverviewCards } from '@/components/analytics/overview-cards'

export const metadata = { title: 'Dashboard — Holy' }

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back. Here&apos;s what&apos;s happening.</p>
      </div>
      <OverviewCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-semibold mb-4">Recent Projects</h2>
          <div className="space-y-3">
            {['Holy Commerce', 'Neon Dashboard', 'Launch Page v2'].map((name, i) => (
              <div key={name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/20 flex items-center justify-center text-xs font-bold text-[#7C3AED]">
                    {name[0]}
                  </div>
                  <span className="text-sm font-medium">{name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{['Active', 'Draft', 'Active'][i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'New Project', href: '/dashboard/projects/new' },
              { label: 'View Analytics', href: '/dashboard/analytics' },
              { label: 'Browse Store', href: '/dashboard/store' },
              { label: 'Revenue', href: '/dashboard/revenue' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="rounded-lg border border-border p-3 text-sm font-medium hover:bg-muted transition-colors text-center"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
