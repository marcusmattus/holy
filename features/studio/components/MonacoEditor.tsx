"use client"

import Editor from '@monaco-editor/react'

export default function MonacoEditor({
  code,
  onChange,
}: {
  code: string
  onChange: (val: string) => void
}) {
  return (
    <Editor
      height="100%"
      defaultLanguage="typescript"
      value={code}
      onChange={(val) => onChange(val || '')}
      theme="vs-dark"
    />
  )
}
