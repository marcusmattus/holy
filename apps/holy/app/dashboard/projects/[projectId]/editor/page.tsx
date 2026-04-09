import { CodePanel } from '@/components/editor/code-panel'
import { PreviewPane } from '@/components/editor/preview-pane'
import { AIAssistant } from '@/components/editor/ai-assistant'

export default function EditorPage({
  params,
}: {
  params: { projectId: string }
}) {
  return (
    <div className="flex h-[calc(100vh-4rem)] -m-6 overflow-hidden">
      <CodePanel />
      <PreviewPane />
      <AIAssistant projectId={params.projectId} />
    </div>
  )
}
