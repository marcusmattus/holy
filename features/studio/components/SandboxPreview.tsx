"use client"

function escapeClosingTags(value: string) {
  return value.replace(/<\/script/gi, "<\\/script")
}

export default function SandboxPreview({ code }: { code: string }) {
  const safeCode = escapeClosingTags(code)

  return (
    <iframe
      title="Holy Studio Preview"
      className="h-full w-full border border-white/10 bg-white"
      sandbox="allow-scripts allow-forms allow-popups allow-modals"
      referrerPolicy="no-referrer"
      srcDoc={`
        <!doctype html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
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
