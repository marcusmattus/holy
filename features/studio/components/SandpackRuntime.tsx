'use client'

import {
  SandpackProvider,
  SandpackLayout,
  SandpackFileExplorer,
  SandpackCodeEditor,
  SandpackPreview,
} from '@codesandbox/sandpack-react'
import type { HolyFileMap } from '../types'
import { holySandpackTheme } from '../lib/sandpack-theme'

export function SandpackRuntime({ files }: { files: HolyFileMap }) {
  return (
    <SandpackProvider
      template="react-ts"
      files={files}
      theme={holySandpackTheme}
      options={{
        activeFile: '/App.tsx',
        visibleFiles: ['/App.tsx', '/src/main.tsx', '/src/styles.css'],
        recompileMode: 'delayed',
        recompileDelay: 500,
      }}
    >
      <SandpackLayout className="!h-full !border-white/10 !bg-transparent">
        <div className="hidden w-56 border-r border-white/10 bg-black/30 xl:block">
          <SandpackFileExplorer />
        </div>
        <div className="w-1/2 min-w-[420px] border-r border-white/10">
          <SandpackCodeEditor showLineNumbers showTabs closableTabs wrapContent />
        </div>
        <div className="flex-1 bg-[#050505]">
          <SandpackPreview showNavigator showOpenInCodeSandbox={false} />
        </div>
      </SandpackLayout>
    </SandpackProvider>
  )
}
