'use client'

import { Sandpack } from '@codesandbox/sandpack-react'
import type { ProjectFiles } from '@/features/studio/types'

interface SandpackPreviewProps {
  files: ProjectFiles
}

export default function SandpackPreview({ files }: SandpackPreviewProps) {
  return (
    <Sandpack
      template="react-ts"
      files={files}
      options={{
        showNavigator: true,
        showTabs: true,
      }}
    />
  )
}
