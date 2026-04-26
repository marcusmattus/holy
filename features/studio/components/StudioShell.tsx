'use client'

import { useState } from 'react'
import { SandpackRuntime } from './SandpackRuntime'
import { AiPatchPanel } from './AiPatchPanel'
import { FileExplorer } from './FileExplorer'
import { StudioTopbar } from './StudioTopbar'
import { ViewportToggle } from './ViewportToggle'
import { defaultHolyFiles } from '../lib/default-files'
import { mergeHolyFiles } from '../lib/file-utils'
import type { HolyFileMap } from '../types'

export function StudioShell() {
  const [files, setFiles] = useState<HolyFileMap>(defaultHolyFiles)
  const [status, setStatus] = useState('ready')
  const [summary, setSummary] = useState('Ready to build')

  function handlePatched(nextFiles: HolyFileMap, patchSummary: string) {
    setFiles((currentFiles) => mergeHolyFiles(currentFiles, nextFiles))
    setSummary(patchSummary)
    setStatus('patched')
  }

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-[#0A0A0A] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(201,162,74,0.08),transparent_40%),radial-gradient(circle_at_85%_80%,rgba(201,162,74,0.05),transparent_40%)] blur-3xl" />
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.02] [background-image:url('data:image/svg+xml,%3Csvg_viewBox=\'0_0_200_200\'_xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter_id=\'noise\'%3E%3CfeTurbulence_type=\'fractalNoise\'_baseFrequency=\'0.65\'_numOctaves=\'3\'_stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect_width=\'100%25\'_height=\'100%25\'_filter=\'url(%23noise)\'/%3E%3C/svg%3E')]" />

      <StudioTopbar status={status} />

      {status !== 'ready' && <div className="h-px bg-gradient-to-r from-transparent via-[#C9A24A] to-transparent" />}

      <main className="grid min-h-0 flex-1 grid-cols-[400px_1fr] overflow-hidden">
        <div className="grid min-h-0 grid-rows-[1fr_auto] overflow-hidden">
          <AiPatchPanel files={files} onPatched={handlePatched} />
          <div className="border-r border-t border-white/10 bg-black/50 p-4">
            <FileExplorer files={files} />
          </div>
        </div>
        <section className="flex min-w-0 flex-col">
          <div className="flex h-10 items-center justify-between border-b border-white/10 bg-black/20 px-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">{summary}</p>
            <ViewportToggle />
          </div>
          <div className="min-h-0 flex-1">
            <SandpackRuntime files={files} />
          </div>
        </section>
      </main>
    </div>
  )
}
