import Link from 'next/link'
import { Plus, Sparkles } from 'lucide-react'

export const metadata = { title: 'Projects — Holy' }

const PROJECTS = [
  {
    id: '1',
    name: 'Holy Commerce',
    status: 'active',
    views: 12400,
    revenue: '$840',
    type: 'E-commerce',
    updated: '2h ago',
  },
  {
    id: '2',
    name: 'Neon Dashboard',
    status: 'active',
    views: 8200,
    revenue: '$320',
    type: 'SaaS Platform',
    updated: '5h ago',
  },
  {
    id: '3',
    name: 'Launch Page v2',
    status: 'draft',
    views: 0,
    revenue: '$0',
    type: 'Landing Page',
    updated: '1d ago',
  },
  {
    id: '4',
    name: 'Analytics Suite',
    status: 'active',
    views: 4100,
    revenue: '$150',
    type: 'Dashboard',
    updated: '3d ago',
  },
]

export default function ProjectsPage() {
  return (
    <div className="space-y-8 relative">
      {/* Ethereal background */}
      <div className="ethereal-bg" />
      <div className="grain" />

      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <h1 className="text-5xl font-light tracking-tight">
            Codebase <span className="font-bold">Archives</span>
          </h1>
          <p className="text-muted-foreground text-lg font-light">
            Manage your generated universes.
          </p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="group rounded-2xl bg-[#C9A24A] px-6 py-3 text-sm font-bold text-black hover:bg-[#C9A24A]/90 transition-all flex items-center space-x-2 gold-glow"
        >
          <Plus className="w-4 h-4" />
          <span>New App</span>
          <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create New Card */}
        <Link
          href="/dashboard/projects/new"
          className="glass-panel rounded-3xl border-dashed flex flex-col items-center justify-center p-12 cursor-pointer group hover:border-[#C9A24A]/50 h-64"
        >
          <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-[#C9A24A] transition-all duration-500">
            <Plus className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-white/40 group-hover:text-white transition-colors">
            Generate new app
          </p>
        </Link>

        {/* Project Cards */}
        {PROJECTS.map((project) => (
          <Link
            key={project.id}
            href={`/dashboard/projects/${project.id}`}
            className="glass-panel shimmer rounded-3xl p-6 flex flex-col h-64 relative overflow-hidden group"
          >
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="space-y-1">
                <h3 className="text-xl font-bold tracking-tight">
                  {project.name}
                </h3>
                <p className="text-xs text-white/40 uppercase tracking-widest">
                  {project.type}
                </p>
              </div>
              <div className="flex items-center space-x-2 bg-black/40 px-3 py-1 rounded-full border border-white/5">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    project.status === 'active' ? 'status-pulse' : 'bg-white/20'
                  }`}
                />
                <span className="text-[10px] font-bold uppercase tracking-tighter">
                  {project.status}
                </span>
              </div>
            </div>

            {/* Preview Abstract Mock */}
            <div className="flex-grow mt-2 rounded-xl bg-black/40 border border-white/5 overflow-hidden flex items-center justify-center relative z-10">
              <div className="grid grid-cols-3 gap-2 w-full p-4">
                <div className="h-2 bg-white/10 rounded-full w-3/4" />
                <div className="h-2 bg-white/10 rounded-full w-full" />
                <div className="h-2 bg-white/10 rounded-full w-1/2" />
                <div className="h-12 bg-white/5 rounded-lg col-span-3" />
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center relative z-10">
              <span className="text-[10px] text-white/30 uppercase tracking-wider">
                Updated {project.updated}
              </span>
              <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm font-bold text-[#C9A24A]">Open →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
