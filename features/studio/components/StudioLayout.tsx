"use client"

import { useState } from 'react'
import dynamic from 'next/dynamic'
import type { ProjectFiles } from '@/features/studio/types'
import CollaboratorAvatars from './CollaboratorAvatars'
import StudioCommentsPanel from './StudioCommentsPanel'
import FileLockBadge from './FileLockBadge'
import ComponentCommentButton from './ComponentCommentButton'

const SandpackPreview = dynamic(() => import('./SandpackPreview'), { ssr: false })

const DEFAULT_FILES: ProjectFiles = {
  '/App.tsx': 'export default function App() { return <div>Start</div> }',
}

const DEMO_PROJECT_ID = 'studio-demo'
const DEMO_USER_ID = 'demo-user'

export default function StudioLayout() {
  const [prompt, setPrompt] = useState('')
  const [files, setFiles] = useState<ProjectFiles>(DEFAULT_FILES)
  const [loading, setLoading] = useState(false)
  const [deploying, setDeploying] = useState(false)
  const [deployUrl, setDeployUrl] = useState<string | null>(null)

  async function handleGenerate() {
    setLoading(true)
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    })
    const data = await res.json()
    if (data.files) {
      setFiles(data.files)
    }
    setLoading(false)
  }

  async function handleDeploy() {
    setDeploying(true)
    const projectId = crypto.randomUUID()
    const res = await fetch('/api/deploy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, files }),
    })
    const data = await res.json()
    setDeployUrl(data.url)
    setDeploying(false)
  }

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white">
      <div className="flex-1 flex flex-col">
        <div className="border-b border-[#C9A24A]/20 p-3 flex items-center justify-between bg-white/5 backdrop-blur">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#C9A24A]">Ethereal studio</p>
            <h1 className="text-sm font-semibold">Realtime collaboration</h1>
          </div>
          <div className="flex items-center gap-2">
            <FileLockBadge filePath="/App.tsx" owner="demo-user" />
            <ComponentCommentButton onClick={() => {}} />
            <CollaboratorAvatars projectId={DEMO_PROJECT_ID} userId={DEMO_USER_ID} />
          </div>
        </div>

        <div className="flex flex-1">
          <div className="w-1/2 p-4 border-r border-[#C9A24A]/20 flex flex-col gap-4">
            <textarea
              className="w-full h-40 rounded border border-white/20 bg-black/40 p-2"
              placeholder="Describe your app idea..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <div className="flex gap-2">
              <button onClick={handleGenerate} className="flex-1 rounded bg-[#C9A24A] text-black p-2">
                {loading ? 'Generating...' : 'Generate App'}
              </button>
              <button onClick={handleDeploy} className="flex-1 rounded bg-[#1F2937] text-white p-2 border border-white/10">
                {deploying ? 'Deploying...' : 'Deploy'}
              </button>
            </div>

            {deployUrl && (
              <p className="text-xs text-green-400">
                Deployed:{' '}
                <a href={deployUrl} target="_blank" rel="noreferrer" className="underline">
                  {deployUrl}
                </a>
              </p>
            )}
          </div>

          <div className="w-1/2 p-4 overflow-auto">
            <SandpackPreview files={files} />
          </div>
        </div>
      </div>

      <StudioCommentsPanel projectId={DEMO_PROJECT_ID} userId={DEMO_USER_ID} />
    </div>
  )
}
