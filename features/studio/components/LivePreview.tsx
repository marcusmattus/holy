'use client'

import { useLivePreview } from '@/features/studio/hooks/useLivePreview'

type LivePreviewProps = {
  code: string
}

export default function LivePreview({ code }: LivePreviewProps) {
  const iframeRef = useLivePreview(code)

  return (
    <iframe
      ref={iframeRef}
      className="h-full w-full border"
      sandbox="allow-scripts"
      title="Holy Studio Live Preview"
    />
  )
}
