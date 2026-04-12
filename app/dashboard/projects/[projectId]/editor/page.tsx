import { CodePanel } from '@/components/editor/code-panel'
import { PreviewPane } from '@/components/editor/preview-pane'
import { AIAssistant } from '@/components/editor/ai-assistant'

export default async function EditorPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  return (
    <div className="flex h-[calc(100vh-4rem)] -m-6 overflow-hidden">
      <CodePanel />
      <PreviewPane />
      <AIAssistant projectId={projectId} />
    </div>
  )
}
