'use client'
import { useState } from 'react'
export function ProjectInsights({ project, onBack }: any) {
  const [activeTab, setActiveTab] = useState('generations')
  const history = [
    {
      version: 'v1.4',
      prompt: 'Add real-time candle charts',
      timestamp: '12m ago',
      author: 'AI Agent',
    },
    {
      version: 'v1.3',
      prompt: 'Implement dark mode toggle',
      timestamp: '2h ago',
      author: 'User',
    },
    {
      version: 'v1.2',
      prompt: 'Style the navigation bar',
      timestamp: '1d ago',
      author: 'AI Agent',
    },
    {
      version: 'v1.1',
      prompt: 'Initial structural layout',
      timestamp: '2d ago',
      author: 'System',
    },
  ]
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/40 backdrop-blur-xl px-8 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <button onClick={onBack} className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full border border-[#C9A24A] flex items-center justify-center font-bold text-lg select-none">
                H
              </div>
              <span className="font-bold tracking-tighter text-xl mt-0.5">
                HOLY
              </span>
            </button>
            <div className="hidden md:flex space-x-6 text-sm font-medium text-white/50">
              <span
                className="hover:text-white transition-colors cursor-pointer"
                onClick={onBack}
              >
                Projects
              </span>
              <span className="text-white border-b border-[#C9A24A] pb-1">
                Insights
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center bg-[#C9A24A] text-black px-4 py-2 rounded-full text-xs font-bold hover:brightness-110 transition-all duration-300">
              Export Data
            </button>
          </div>
        </div>
      </nav>
      <main className="flex-grow max-w-[1400px] mx-auto w-full px-8 py-12">
        <header className="mb-12 space-y-6">
          <div className="flex items-center space-x-3 text-xs uppercase tracking-[0.2em] text-white/30">
            <button
              onClick={onBack}
              className="hover:text-white transition-colors"
            >
              Projects
            </button>
            <span>/</span>
            <span className="text-white/60">{project?.name || 'Project'}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <h1 className="text-4xl font-bold tracking-tight">
                  {project?.name || 'Project Insights'}
                </h1>
                <div className="flex items-center space-x-2 bg-[#C9A24A]/10 border border-[#C9A24A]/20 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-[#C9A24A] shadow-[0_0_10px_#C9A24A] animate-pulse"></div>
                  <span className="text-[10px] font-bold text-[#C9A24A] uppercase tracking-tighter">
                    Live Build
                  </span>
                </div>
              </div>
              <p className="text-white/40 text-lg font-light">
                Infrastructure & generation telemetry for{' '}
                <span className="text-white">
                  {project?.name || 'project'}.holy.app
                </span>
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={onBack}
                className="glass-panel px-6 py-3 rounded-2xl text-xs font-bold hover:border-white/20 transition-all"
              >
                Edit App
              </button>
              <button className="glass-panel px-6 py-3 rounded-2xl text-xs font-bold bg-white text-black hover:bg-[#C9A24A] transition-all">
                View Analytics
              </button>
            </div>
          </div>
        </header>
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <div className="glass-panel rounded-3xl p-6 space-y-8">
              <div>
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-4 font-bold">
                  Menu
                </h4>
                <div className="space-y-1">
                  <button
                    onClick={() => setActiveTab('generations')}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all hover:text-white ${activeTab === 'generations' ? 'text-white bg-white/5' : 'text-white/40'}`}
                  >
                    Generation History
                  </button>
                  <button
                    onClick={() => setActiveTab('traffic')}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all hover:text-white ${activeTab === 'traffic' ? 'text-white bg-white/5' : 'text-white/40'}`}
                  >
                    Edge Traffic
                  </button>
                </div>
              </div>
              <div className="pt-6 border-t border-white/5">
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-4 font-bold">
                  Telemetry
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40 tracking-tight">
                      Active Users
                    </span>
                    <span className="text-xs font-bold text-white">1,204</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40 tracking-tight">
                      Latency
                    </span>
                    <span className="text-xs font-bold text-[#C9A24A]">
                      42ms
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-9 space-y-6">
            <div className="glass-panel rounded-3xl overflow-hidden">
              <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                <h3 className="text-sm font-bold tracking-widest uppercase">
                  Version Timeline
                </h3>
              </div>
              <div className="divide-y divide-white/5">
                {history.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-8 hover:bg-white/[0.02] transition-all relative group flex flex-col md:flex-row md:items-center gap-6"
                  >
                    <div className="flex items-start md:items-center space-x-6 md:w-1/4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-[#C9A24A]">
                        {item.version}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white uppercase tracking-tighter">
                          {item.author}
                        </span>
                        <span className="text-[10px] text-white/30">
                          {item.timestamp}
                        </span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-light text-white/80 leading-relaxed italic">
                        "{item.prompt}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
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
        </div>
      </footer>
    </div>
  )
}
