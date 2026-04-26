"use client"

import { useState } from 'react'
import dynamic from 'next/dynamic'
import type { ProjectFiles } from '@/features/studio/types'

const SandpackPreview = dynamic(
  () => import('./SandpackPreview'),
  { ssr: false }
)

const DEFAULT_FILES: ProjectFiles = {
  '/App.tsx': 'export default function App() { return <div>Start</div> }',
}

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
    <div className="flex h-screen">
      {/* Left panel */}
      <div className="w-1/2 p-4 border-r flex flex-col gap-4">
        <textarea
          className="w-full h-40 border p-2"
          placeholder="Describe your app idea..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            onClick={handleGenerate}
            className="flex-1 bg-black text-white p-2"
          >
            {loading ? 'Generating...' : 'Generate App'}
          </button>
          <button
            onClick={handleDeploy}
            className="flex-1 bg-violet-600 text-white p-2"
          >
            {deploying ? 'Deploying...' : 'Deploy'}
          </button>
        </div>

        {deployUrl && (
          <p className="text-xs text-green-600">
            Deployed:{' '}
            <a href={deployUrl} target="_blank" rel="noreferrer" className="underline">
              {deployUrl}
            </a>
          </p>
        )}
      </div>

      {/* Right panel */}
      <div className="w-1/2 p-4 overflow-auto">
        <SandpackPreview files={files} />
      </div>
    </div>
  )
}
