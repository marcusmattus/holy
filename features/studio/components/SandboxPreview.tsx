"use client"

function escapeClosingTags(input: string) {
  return input.replace(/<\/script/gi, '<\\/script')
}

export default function SandboxPreview({ code }: { code: string }) {
  return (
    <iframe
      className="w-full h-full border"
      title="Holy Studio Preview"
      sandbox="allow-scripts allow-forms"
      srcDoc={`
        <html>
          <head>
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body>
            <div id="root">${escapeClosingTags(code)}</div>
          </body>
        </html>
      `}
    />
  )
}
