const PAGES = [
  { path: '/', views: 12400, bounce: '32%', duration: '2m 14s' },
  { path: '/pricing', views: 8200, bounce: '28%', duration: '3m 02s' },
  { path: '/dashboard', views: 6100, bounce: '18%', duration: '5m 41s' },
  { path: '/store', views: 4800, bounce: '41%', duration: '1m 58s' },
  { path: '/login', views: 3200, bounce: '22%', duration: '0m 48s' },
]

export function TopPagesTable() {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold">Top Pages</h2>
      </div>
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">
              Page
            </th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">
              Views
            </th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">
              Bounce Rate
            </th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">
              Avg Duration
            </th>
          </tr>
        </thead>
        <tbody>
          {PAGES.map(({ path, views, bounce, duration }) => (
            <tr
              key={path}
              className="border-b border-border last:border-0 hover:bg-muted/30"
            >
              <td className="px-4 py-3 font-mono text-xs text-[#7C3AED]">
                {path}
              </td>
              <td className="px-4 py-3">{views.toLocaleString()}</td>
              <td className="px-4 py-3 text-muted-foreground">{bounce}</td>
              <td className="px-4 py-3 text-muted-foreground">{duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
