"use client"

import dynamic from "next/dynamic"

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#0A0A0A] text-sm text-white/40">
      Loading editor…
    </div>
  ),
})

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
      onChange={(val) => onChange(val || "")}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 13,
        wordWrap: "on",
        automaticLayout: true,
        scrollBeyondLastLine: false,
      }}
    />
  )
}
