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
    doc.write(`
      <html>
        <body>
          <div id="root"></div>
          <script type="module">
            ${code}
          </script>
        </body>
      </html>
    `)
    doc.close()
  }, [code])

  return iframeRef
}
