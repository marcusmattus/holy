'use client'

import { useState } from 'react'

export function AIWorkspace({
  project,
  onBack,
  onDeploy,
  onViewInsights,
}: any) {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile' | 'code'>(
    'desktop',
  )
  const [history, setHistory] = useState([
    {
      role: 'user',
      content:
        'Create a minimalist crypto wallet dashboard with a focus on ease of use.',
    },
    {
      role: 'ai',
      content:
        'Generating mobile-first architecture. Applying Space Grotesk and gold accents...',
    },
  ])

  const handleGenerate = () => {
    if (!prompt) return
    setHistory([...history, { role: 'user', content: prompt }])
    setIsGenerating(true)
    setPrompt('')

    setTimeout(() => {
      setIsGenerating(false)
      setHistory((prev) => [
        ...prev,
        {
          role: 'ai',
          content:
            'Layout adjusted. Components updated with your specifications.',
        },
      ])
    }, 2000)
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <nav className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-black/40 backdrop-blur-xl z-50">
        <div className="flex items-center space-x-6">
          <button onClick={onBack} className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full border border-[#C9A24A] flex items-center justify-center font-bold text-sm hover:scale-110 transition-transform">
              H
            </div>
            <div className="h-4 w-[1px] bg-white/10"></div>
            <div className="flex flex-col">
              <span className="text-xs font-bold tracking-tighter">
                PROJECT
              </span>
              <span className="text-[10px] text-white/40 uppercase">
                {project?.name || 'New Project'}
              </span>
            </div>
          </button>
        </div>

        <div className="flex items-center bg-white/5 p-1 rounded-full border border-white/10">
          <button
            onClick={() => setViewMode('desktop')}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all tracking-widest ${viewMode === 'desktop' ? 'bg-white/10 text-white' : 'text-white/40'}`}
          >
            Desktop
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all tracking-widest ${viewMode === 'mobile' ? 'bg-white/10 text-white' : 'text-white/40'}`}
          >
            Mobile
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all tracking-widest ${viewMode === 'code' ? 'bg-white/10 text-white' : 'text-white/40'}`}
          >
            Code
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={onViewInsights}
            className="text-xs text-white/40 hover:text-white transition-colors"
          >
            Insights
          </button>
          <button
            onClick={onDeploy}
            className="bg-[#C9A24A] text-black px-5 py-2 rounded-full text-xs font-bold tracking-tight hover:scale-105 transition-all shadow-[0_0_20px_rgba(201,162,74,0.2)]"
          >
            Deploy App
          </button>
        </div>
      </nav>

      <main className="flex-grow flex overflow-hidden">
        <aside className="w-[400px] border-r border-white/5 flex flex-col bg-black/20 overflow-hidden">
          <div className="flex-grow overflow-y-auto p-6 space-y-8">
            {history.map((message, idx) => (
              <div
                key={idx}
                className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500"
              >
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] uppercase tracking-widest font-bold ${message.role === 'user' ? 'text-white/40' : 'text-[#C9A24A]'}`}
                  >
                    {message.role === 'user' ? 'You' : 'Holy AI'}
                  </span>
                  {message.role === 'ai' && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C9A24A]"></div>
                  )}
                </div>
                <p
                  className={`text-sm font-light leading-relaxed text-white/80 ${message.role === 'ai' ? 'italic' : ''}`}
                >
                  {message.content}
                </p>
              </div>
            ))}

            {isGenerating && (
              <div className="space-y-3">
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#C9A24A]">
                  Architecting...
                </span>
                <div className="h-24 w-full glass-panel rounded-2xl ai-shimmer"></div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-white/5 bg-black/40">
            <div className="relative group">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleGenerate()
                  }
                }}
                placeholder="Refine the interface..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-12 text-sm focus:outline-none focus:border-[#C9A24A]/50 transition-all resize-none h-24 placeholder-white/20"
              />
              <button
                onClick={handleGenerate}
                className="absolute bottom-4 right-4 bg-white/10 p-2 rounded-lg text-white hover:text-[#C9A24A] transition-colors"
              >
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setPrompt('Add a tab navigation bar')}
                className="text-[10px] uppercase tracking-tighter text-white/30 hover:text-[#C9A24A] transition-colors"
              >
                ✦ Add Tab bar
              </button>
              <button
                onClick={() => setPrompt('Enhance dark mode contrast')}
                className="text-[10px] uppercase tracking-tighter text-white/30 hover:text-[#C9A24A] transition-colors"
              >
                ✦ Dark mode
              </button>
            </div>
          </div>
        </aside>

        <section className="flex-grow flex items-center justify-center bg-[#050505] p-12 relative">
          {viewMode === 'mobile' && (
            <div className="w-[375px] h-[667px] relative bg-black overflow-hidden group rounded-3xl border-8 border-black shadow-2xl">
              <div className="absolute inset-0 flex flex-col bg-[#0d0d0d]">
                <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
                  <div className="w-8 h-8 rounded-full bg-[#C9A24A]/10 flex items-center justify-center">
                    <div className="w-3 h-3 bg-[#C9A24A] rounded-full"></div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full border border-white/20"></div>
                    <div className="w-2 h-2 rounded-full border border-white/20"></div>
                  </div>
                </div>
                <div className="flex-grow p-6 space-y-8">
                  <header>
                    <span className="text-[10px] tracking-widest text-white/40 uppercase">
                      Portfolio Balance
                    </span>
                    <div className="flex items-end space-x-2 mt-1">
                      <h1 className="text-4xl font-bold">$42,069</h1>
                      <span className="text-[#C9A24A] text-xs font-bold mb-1">
                        +12.4%
                      </span>
                    </div>
                  </header>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="glass-panel p-4 rounded-2xl flex items-center justify-between relative group/item"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs">
                            ETH
                          </div>
                          <div>
                            <p className="text-sm font-bold">Ethereum</p>
                            <p className="text-[10px] text-white/40">
                              2.45 ETH
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">$3,420</p>
                          <p className="text-[10px] text-[#C9A24A]">Mainnet</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="h-32 w-full glass-panel rounded-2xl p-4 flex items-end space-x-1">
                    <div className="bg-[#C9A24A]/20 w-full h-1/2 rounded-t"></div>
                    <div className="bg-[#C9A24A]/40 w-full h-3/4 rounded-t"></div>
                    <div className="bg-[#C9A24A] w-full h-full rounded-t shadow-[0_0_15px_rgba(201,162,74,0.4)]"></div>
                    <div className="bg-[#C9A24A]/60 w-full h-2/3 rounded-t"></div>
                    <div className="bg-[#C9A24A]/30 w-full h-1/2 rounded-t"></div>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <button className="w-full bg-white text-black py-4 rounded-2xl font-bold text-sm tracking-tight hover:bg-[#C9A24A] transition-colors">
                    Swap Assets
                  </button>
                </div>
              </div>
            </div>
          )}
          {viewMode === 'desktop' && (
            <div className="w-full max-w-5xl h-[80%] bg-white rounded-2xl overflow-hidden shadow-2xl">
              <div className="h-full p-8 space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold text-gray-900">
                    Dashboard Preview
                  </h2>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="p-6 border border-gray-200 rounded-2xl"
                    >
                      <div className="text-sm text-gray-500 mb-2">
                        Metric {i}
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        $42,084
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {viewMode === 'code' && (
            <div className="w-full max-w-4xl h-[80%] bg-[#1e1e1e] rounded-2xl overflow-hidden shadow-2xl p-6 font-mono text-sm">
              <div className="space-y-2">
                <p className="text-blue-400">
                  import <span className="text-white">{'{ useState }'}</span>{' '}
                  from <span className="text-green-400">'react'</span>
                </p>
                <p className="text-purple-400">
                  export default function{' '}
                  <span className="text-yellow-400">Dashboard</span>() {'{'}
                </p>
                <p className="pl-4 text-white">return (</p>
                <p className="pl-8 text-gray-400">{'<div className="p-8">'}</p>
                <p className="pl-12 text-gray-400">{'<h1>Portfolio</h1>'}</p>
                <p className="pl-8 text-gray-400">{'</div>'}</p>
                <p className="pl-4 text-white">)</p>
                <p className="text-purple-400">{'}'}</p>
              </div>
            </div>
          )}
          <div className="absolute bottom-8 right-8 flex space-x-2">
            <div className="glass-panel px-4 py-2 rounded-full flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-[#C9A24A] shadow-[0_0_10px_#C9A24A]"></div>
              <span className="text-[10px] font-bold tracking-widest uppercase">
                Live Syncing
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
