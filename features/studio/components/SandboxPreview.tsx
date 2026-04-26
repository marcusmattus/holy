"use client"

function escapeClosingScriptTag(input: string) {
  return input.replaceAll("</script>", "<\\/script>")
}

export default function SandboxPreview({ code }: { code: string }) {
  const safeCode = escapeClosingScriptTag(code)

  return (
    <iframe
      className="w-full h-full border"
      title="Live sandbox preview"
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
