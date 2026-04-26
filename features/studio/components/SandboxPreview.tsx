"use client"

export default function SandboxPreview({ code }: { code: string }) {
  return (
    <iframe
      className="w-full h-full border"
      srcDoc={`
        <html>
          <head>
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body>
            <div id="root">${code}</div>
          </body>
        </html>
      `}
    />
  )
}
