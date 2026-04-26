'use client'

import { useEffect, useRef } from 'react'

export function useLivePreview(code: string) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const doc = iframeRef.current?.contentDocument
    if (!doc) {
      return
    }

    doc.open()
    doc.write('<!doctype html><html><body><div id="root"></div></body></html>')
    doc.close()

    const script = doc.createElement('script')
    script.type = 'module'
    script.textContent = code
    doc.body.appendChild(script)
  }, [code])

  return iframeRef
}
