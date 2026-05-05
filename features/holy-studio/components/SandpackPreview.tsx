'use client'

import { Sandpack } from '@codesandbox/sandpack-react'
import type { GeneratedAppManifest } from '../types'

function toSandpackFiles(manifest: GeneratedAppManifest) {
  return Object.fromEntries(
    manifest.files.map((file) => [`/${file.path}`, { code: file.content }])
  )
}

export function SandpackPreview({ manifest }: { manifest: GeneratedAppManifest }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black">
      <Sandpack
        template="nextjs"
        files={toSandpackFiles(manifest)}
        options={{
          showNavigator: true,
          showTabs: true,
          editorHeight: 560,
          externalResources: ['https://cdn.tailwindcss.com'],
        }}
      />
    </div>
  )
}
