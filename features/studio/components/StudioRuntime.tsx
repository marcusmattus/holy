"use client"

import { useState } from "react"
import MonacoEditor from "./MonacoEditor"
import SandboxPreview from "./SandboxPreview"

export default function StudioRuntime() {
  const [code, setCode] = useState(`<div class='p-10'>Edit me</div>`)

  return (
    <div className="flex h-screen">
      {/* Editor */}
      <div className="w-1/2 border-r">
        <MonacoEditor code={code} onChange={setCode} />
      </div>

      {/* Live Preview */}
      <div className="w-1/2">
        <SandboxPreview code={code} />
      </div>
    </div>
  )
}
