'use client'

import { useMemo, useState } from 'react'
import Editor from '@monaco-editor/react'
import type { HolyProject } from '../types'
import { SandpackPreview } from '@/features/holy-studio/components/SandpackPreview'

export function ProjectEditor({ initialProject }: { initialProject: HolyProject }) {
  const [project, setProject] = useState(initialProject)
  const [selectedPath, setSelectedPath] = useState(initialProject.manifest.files[0]?.path || '')
  const [saving, setSaving] = useState(false)

  const selectedFile = useMemo(
    () => project.manifest.files.find((file) => file.path === selectedPath),
    [project, selectedPath]
  )

  function updateSelectedFile(content: string) {
    setProject((current) => ({
      ...current,
      manifest: {
        ...current.manifest,
        files: current.manifest.files.map((file) =>
          file.path === selectedPath ? { ...file, content } : file
        ),
      },
    }))
  }

  async function saveProject() {
    setSaving(true)
    await fetch(`/api/projects/${project.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ manifest: project.manifest, status: 'editing' }),
    })
    setSaving(false)
  }

  return (
    <div className="grid min-h-[760px] gap-4 xl:grid-cols-[240px_1fr_1fr]">
      <aside className="rounded-xl border border-white/10 bg-black/40 p-3">
        <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/50">Files</div>
        <div className="space-y-1">
          {project.manifest.files.map((file) => (
            <button
              key={file.path}
              type="button"
              onClick={() => setSelectedPath(file.path)}
              className={`w-full rounded-md px-2 py-2 text-left text-sm ${selectedPath === file.path ? 'bg-[#C9A24A] text-black' : 'text-white/70 hover:bg-white/10'}`}
            >
              {file.path}
            </button>
          ))}
        </div>
      </aside>

      <section className="overflow-hidden rounded-xl border border-white/10 bg-black">
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
          <span className="text-sm text-white/60">{selectedPath}</span>
          <button
            type="button"
            onClick={saveProject}
            className="rounded-md bg-[#C9A24A] px-3 py-1.5 text-sm text-black"
          >
            {saving ? 'Saving...' : 'Save edits'}
          </button>
        </div>
        <Editor
          height="700px"
          theme="vs-dark"
          path={selectedPath}
          defaultLanguage={selectedFile?.language === 'css' ? 'css' : selectedFile?.language === 'json' ? 'json' : 'typescript'}
          value={selectedFile?.content || ''}
          onChange={(value) => updateSelectedFile(value || '')}
          options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: 'on' }}
        />
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">Live Preview</h2>
          <p className="text-sm text-white/50">Updates as you edit the generated project files.</p>
        </div>
        <SandpackPreview manifest={project.manifest} />
      </section>
    </div>
  )
}
