'use client'

import CodeEditor from './CodeEditor'
import LivePreview from './LivePreview'
import PromptInput from './PromptInput'
import { useGeneration } from '@/features/studio/hooks/useGeneration'

export default function StudioLayout() {
  const { code, setCode, generate, loading, error } = useGeneration(`const root = document.getElementById('root')
if (root) {
  root.innerHTML = '<div style="padding: 24px; font-family: Inter, Arial, sans-serif;"><h1>Holy Studio</h1><p>Start building...</p></div>'
}`)

  return (
    <div className="flex h-screen flex-col">
      <PromptInput onGenerate={generate} loading={loading} error={error} />

      <div className="flex flex-1">
        <div className="h-full w-1/2 border-r">
          <CodeEditor value={code} onChange={setCode} />
        </div>
        <div className="h-full w-1/2">
          <LivePreview code={code} />
        </div>
      </div>
    </div>
  )
}
