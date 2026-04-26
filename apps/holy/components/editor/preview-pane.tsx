'use client'

import { useState } from 'react'
import { Monitor, Smartphone, Code2, RotateCcw } from 'lucide-react'

export function PreviewPane() {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile' | 'code'>(
    'desktop',
  )

  return (
    <div className="flex-1 flex flex-col bg-[#0F0F0F] relative overflow-hidden">
      {/* Subtle ethereal gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#C9A24A]/3 via-transparent to-transparent pointer-events-none" />

      {/* Toolbar */}
      <div className="h-10 bg-black/20 border-b border-white/5 flex items-center justify-between px-4 backdrop-blur-md relative z-10">
        <div className="flex items-center space-x-4 text-[10px] text-white/30 font-bold uppercase tracking-widest">
          <span>
            Viewport: <span className="text-white">{viewMode}</span>
          </span>
          <span>Scale: 100%</span>
        </div>
        <div className="flex items-center space-x-1 bg-white/5 rounded-lg p-1">
          <button
            onClick={() => setViewMode('desktop')}
            className={`p-1.5 rounded transition-all ${
              viewMode === 'desktop'
                ? 'bg-white/10 text-white'
                : 'text-white/40 hover:text-white'
            }`}
            title="Desktop"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`p-1.5 rounded transition-all ${
              viewMode === 'mobile'
                ? 'bg-white/10 text-white'
                : 'text-white/40 hover:text-white'
            }`}
            title="Mobile"
          >
            <Smartphone className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`p-1.5 rounded transition-all ${
              viewMode === 'code'
                ? 'bg-white/10 text-white'
                : 'text-white/40 hover:text-white'
            }`}
            title="Code"
          >
            <Code2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex items-center justify-center p-12 overflow-y-auto relative z-10">
        <div
          className={`transition-all duration-500 ${
            viewMode === 'mobile'
              ? 'w-[320px] h-[600px]'
              : viewMode === 'code'
                ? 'w-full max-w-4xl h-[600px]'
                : 'w-full max-w-5xl h-[700px]'
          } bg-white rounded-2xl overflow-hidden shadow-2xl border-[8px] border-black/50`}
        >
          {/* Generated App UI */}
          <div className="h-full bg-white text-slate-900 flex flex-col">
            {viewMode === 'code' ? (
              // Code View
              <div className="h-full bg-[#0d0d0d] p-8 font-mono text-sm overflow-y-auto">
                <div className="flex flex-col space-y-1 text-white/80">
                  <p className="text-blue-400">
                    import{' '}
                    <span className="text-white">{'{ Card, Header }'}</span>{' '}
                    from <span className="text-[#C9A24A]">'@holy/ui'</span>;
                  </p>
                  <p className="text-gray-600">
                    // AI Generated React Component
                  </p>
                  <p className="text-white">
                    <span className="text-purple-400">
                      export default function
                    </span>{' '}
                    <span className="text-yellow-200">FinanceDashboard</span>(){' '}
                    {'{'}
                  </p>
                  <div className="pl-4">
                    <p className="text-white">
                      <span className="text-purple-400">return</span> (
                    </p>
                    <div className="pl-4">
                      <p className="text-blue-300">
                        &lt;main <span className="text-white">className=</span>
                        <span className="text-[#C9A24A]">
                          "flex h-screen bg-white"
                        </span>
                        &gt;
                      </p>
                      <div className="pl-4">
                        <p className="text-blue-300">
                          &lt;Header <span className="text-white">title=</span>
                          <span className="text-[#C9A24A]">
                            "Performance"
                          </span>{' '}
                          /&gt;
                        </p>
                      </div>
                      <p className="text-blue-300">&lt;/main&gt;</p>
                    </div>
                    <p className="text-white">);</p>
                  </div>
                  <p className="text-white">{'}'}</p>
                </div>
              </div>
            ) : (
              <>
                {/* App Sidebar (desktop only) */}
                {viewMode === 'desktop' && (
                  <div className="w-64 border-r border-slate-100 flex flex-col p-6 space-y-8">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600" />
                    <div className="space-y-4">
                      <div className="h-3 bg-slate-100 rounded-full w-full" />
                      <div className="h-3 bg-slate-100 rounded-full w-3/4" />
                      <div className="h-3 bg-slate-100 rounded-full w-5/6" />
                    </div>
                  </div>
                )}

                {/* App Content */}
                <div className="flex-grow p-10 space-y-10 overflow-y-auto">
                  <div className="flex justify-between items-end">
                    <div className="space-y-2">
                      <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                        Portfolio Performance
                      </h1>
                      <p className="text-slate-400">
                        Welcome back, your assets are up 12.4% this week.
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-200" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="group p-6 rounded-2xl border border-slate-100 relative transition-all hover:border-[#C9A24A]/20">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Total Balance
                      </span>
                      <p className="text-2xl font-bold mt-2">$42,084.20</p>
                    </div>
                    <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Monthly Growth
                      </span>
                      <p className="text-2xl font-bold mt-2 text-emerald-500">
                        +18.2%
                      </p>
                    </div>
                    <div className="p-6 rounded-2xl border border-slate-100">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Risk Factor
                      </span>
                      <p className="text-2xl font-bold mt-2">Low</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-full py-2 px-3 shadow-2xl z-50">
        <button className="p-2 hover:bg-white/10 rounded-full transition-all group relative">
          <RotateCcw className="w-4 h-4 text-white/60" />
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-black whitespace-nowrap">
            REGENERATE
          </span>
        </button>
      </div>
    </div>
  )
}
