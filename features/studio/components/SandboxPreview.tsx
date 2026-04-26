"use client"

function escapeClosingTags(value: string) {
  return value.replaceAll('</script', '<\\/script')
}

export default function SandboxPreview({ code }: { code: string }) {
  const safeCode = escapeClosingTags(code)

  return (
    <iframe
      title="Sandbox Preview"
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
