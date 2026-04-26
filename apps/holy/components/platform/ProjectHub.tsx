'use client'

import { useState } from 'react'

interface Project {
  id: number
  name: string
  status: 'Live' | 'Draft' | 'Building'
  updated: string
  type: string
}

export function ProjectHub({
  onSelectProject,
  onNewProject,
}: {
  onSelectProject: (project: Project) => void
  onNewProject: () => void
}) {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [projects] = useState<Project[]>([
    {
      id: 1,
      name: 'Stark Finance',
      status: 'Live',
      updated: '2h ago',
      type: 'Fintech Dashboard',
    },
    {
      id: 2,
      name: 'Lumina Portfolio',
      status: 'Draft',
      updated: '5h ago',
      type: 'Design System',
    },
    {
      id: 3,
      name: 'Vibe CRM',
      status: 'Building',
      updated: '12m ago',
      type: 'AI SaaS',
    },
    {
      id: 4,
      name: 'Ether Shop',
      status: 'Live',
      updated: '1d ago',
      type: 'E-commerce',
    },
  ])

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/20 backdrop-blur-md px-8 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full border border-[#C9A24A] flex items-center justify-center font-bold text-lg select-none">
                H
              </div>
              <span className="font-bold tracking-tighter text-xl mt-0.5">
                HOLY
              </span>
            </div>
            <div className="hidden md:flex space-x-6 text-sm font-medium text-white/50">
              <a
                href="#"
                className="hover:text-white transition-colors text-white"
              >
                Projects
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Store
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Insights
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center bg-white text-black px-4 py-2 rounded-full text-xs font-bold hover:bg-[#C9A24A] transition-all duration-300 gold-glow-hover"
            >
              <span className="mr-2 text-base">+</span> New App
            </button>
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 overflow-hidden cursor-pointer hover:border-[#C9A24A] transition-all">
              <svg viewBox="0 0 32 32" className="w-full h-full">
                <circle cx="16" cy="16" r="16" fill="#1a1a1a" />
                <circle cx="16" cy="12" r="5" fill="#C9A24A" />
                <path
                  d="M6 26c0-5.5 4.5-10 10-10s10 4.5 10 10"
                  fill="#C9A24A"
                />
              </svg>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow max-w-[1400px] mx-auto w-full px-8 py-16">
        {/* Header & Search */}
        <header className="mb-16 space-y-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-5xl font-light tracking-tight">
              Codebase <span className="font-bold">Archives</span>
            </h1>
            <p className="text-white/40 text-lg">
              Manage your generated universes.
            </p>
          </div>

          <div className="relative w-full max-w-2xl group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg
                className="w-4 h-4 text-white/30 group-focus-within:text-[#C9A24A] transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search apps, components, or drafts..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#C9A24A]/50 transition-all text-white placeholder-white/20 text-sm"
            />
          </div>
        </header>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Card */}
          <div
            onClick={() => setShowModal(true)}
            className="glass-panel rounded-3xl border-dashed flex flex-col items-center justify-center p-12 cursor-pointer group hover:border-[#C9A24A]/50"
          >
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-[#C9A24A] transition-all duration-500">
              <span className="text-2xl font-light">+</span>
            </div>
            <p className="text-sm font-medium text-white/40 group-hover:text-white transition-colors">
              Generate new app
            </p>
          </div>

          {/* Project Cards */}
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="glass-panel rounded-3xl p-6 flex flex-col h-64 shimmer relative overflow-hidden group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
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
                    className={`w-1.5 h-1.5 rounded-full ${project.status === 'Draft' ? 'bg-gray-500' : 'bg-[#C9A24A] shadow-[0_0_8px_#C9A24A] animate-pulse'}`}
                  />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Preview Mock */}
              <div className="flex-grow mt-2 rounded-xl bg-black/40 border border-white/5 overflow-hidden flex items-center justify-center">
                <div className="grid grid-cols-3 gap-2 w-full p-4">
                  <div className="h-2 bg-white/10 rounded-full w-3/4"></div>
                  <div className="h-2 bg-white/10 rounded-full w-full"></div>
                  <div className="h-2 bg-white/10 rounded-full w-1/2"></div>
                  <div className="h-12 bg-white/5 rounded-lg col-span-3"></div>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <span className="text-[10px] text-white/30 uppercase">
                  Updated {project.updated}
                </span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                  <button className="p-2 hover:text-[#C9A24A] transition-colors">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      ></path>
                    </svg>
                  </button>
                  <button className="p-2 hover:text-[#C9A24A] transition-colors">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal: New App Generation */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl"
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-panel w-full max-w-2xl rounded-[40px] p-10 relative overflow-hidden"
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>

            <div className="text-center space-y-4 mb-10">
              <span className="text-[#C9A24A] uppercase tracking-[0.3em] font-bold text-[10px]">
                Step 01 / Generation
              </span>
              <h2 className="text-4xl font-bold">
                What are we building today?
              </h2>
              <p className="text-white/40">
                Describe your vision. Holy will handle the design, code, and
                deployment.
              </p>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <textarea
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 focus:outline-none focus:border-[#C9A24A]/50 text-xl font-light placeholder-white/10 resize-none"
                  placeholder="e.g. A sleek stock trading dashboard for retail investors with real-time charts and dark mode..."
                />

                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <button
                    onClick={() => {
                      setShowModal(false)
                      onNewProject()
                    }}
                    className="bg-[#C9A24A] text-black px-6 py-2 rounded-full font-bold text-sm gold-glow-hover transition-all"
                  >
                    Generate ✨
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                <button className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full text-xs text-white/60 border border-white/5 transition-all">
                  SaaS Landing Page
                </button>
                <button className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full text-xs text-white/60 border border-white/5 transition-all">
                  iOS Design System
                </button>
                <button className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full text-xs text-white/60 border border-white/5 transition-all">
                  Crypto Wallet UI
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="px-8 py-10 border-t border-white/5 bg-black/40 text-center">
        <p className="text-[10px] text-white/20 uppercase tracking-[0.4em] mb-4">
          Crafting the Future of Web Creation
        </p>
        <div className="flex justify-center space-x-6 text-white/40 text-xs">
          <a href="#" className="hover:text-[#C9A24A] transition-colors">
            Documentation
          </a>
          <a href="#" className="hover:text-[#C9A24A] transition-colors">
            API
          </a>
          <a href="#" className="hover:text-[#C9A24A] transition-colors">
            Legal
          </a>
          <a href="#" className="hover:text-[#C9A24A] transition-colors">
            Status
          </a>
        </div>
      </footer>
    </div>
  )
}
