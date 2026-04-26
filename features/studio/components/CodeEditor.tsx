'use client'

import dynamic from 'next/dynamic'

const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
})

type CodeEditorProps = {
  value: string
  onChange: (value: string) => void
}

export default function CodeEditor({ value, onChange }: CodeEditorProps) {
  return (
    <Editor
      height="100%"
      defaultLanguage="typescript"
      value={value}
      onChange={(val) => onChange(val || '')}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        automaticLayout: true,
      }}
    />
  )
}
