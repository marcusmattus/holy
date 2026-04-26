"use client"

function escapeClosingScriptTags(code: string) {
  return code.replace(/<\/script/gi, '<\\/script')
}

export default function SandboxPreview({ code }: { code: string }) {
  const safeCode = escapeClosingScriptTags(code)

  return (
    <iframe
      title="Holy Sandbox Preview"
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
