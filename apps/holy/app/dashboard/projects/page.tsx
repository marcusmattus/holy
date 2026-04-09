import Link from 'next/link'

export const metadata = { title: 'Projects — Holy' }

const PROJECTS = [
  {
    id: '1',
    name: 'Holy Commerce',
    status: 'active',
    views: 12400,
    revenue: '$840',
  },
  {
    id: '2',
    name: 'Neon Dashboard',
    status: 'active',
    views: 8200,
    revenue: '$320',
  },
  { id: '3', name: 'Launch Page v2', status: 'draft', views: 0, revenue: '$0' },
  {
    id: '4',
    name: 'Analytics Suite',
    status: 'active',
    views: 4100,
    revenue: '$150',
  },
]

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your Holy projects
          </p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="rounded-lg bg-[#7C3AED] px-4 py-2 text-sm font-semibold text-white hover:bg-[#6D28D9] transition-colors"
        >
          + New Project
        </Link>
      </div>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Name
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Status
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Views
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Revenue
              </th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {PROJECTS.map((p) => (
              <tr
                key={p.id}
                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      p.status === 'active'
                        ? 'bg-[#10B981]/20 text-[#10B981]'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {p.views.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{p.revenue}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/dashboard/projects/${p.id}`}
                    className="text-[#7C3AED] hover:underline text-xs"
                  >
                    Open →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
