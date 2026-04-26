"use client"

function sanitizePreviewCode(input: string) {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('</script>', '<\\/script>')
}

export default function SandboxPreview({ code }: { code: string }) {
  const safeCode = sanitizePreviewCode(code)

  return (
    <iframe
      className="w-full h-full border"
      sandbox="allow-scripts allow-forms allow-popups allow-modals"
      referrerPolicy="no-referrer"
      srcDoc={`
        <html>
          <head>
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body>
            <div id="root">${safeCode}</div>
          </body>
        </html>
      `}
    />
  )
}
