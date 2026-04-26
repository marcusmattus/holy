import type { HolyFileMap } from '../types'

export const defaultHolyFiles: HolyFileMap = {
  '/App.tsx': `export default function App() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white p-10 font-sans">
      <section className="max-w-4xl mx-auto rounded-[32px] border border-white/10 bg-white/[0.03] p-10">
        <p className="text-[#C9A24A] text-xs uppercase tracking-[0.3em] font-bold">Holy Studio</p>
        <h1 className="mt-4 text-5xl font-bold tracking-tight">Generated app runtime</h1>
        <p className="mt-4 text-white/50">Edit files or ask Holy AI to patch the app.</p>
      </section>
    </main>
  )
}`,
  '/package.json': `{
  "dependencies": {
    "@vitejs/plugin-react": "latest",
    "vite": "latest",
    "react": "latest",
    "react-dom": "latest",
    "lucide-react": "latest"
  },
  "devDependencies": {}
}`,
  '/index.html': `<div id="root"></div><script type="module" src="/src/main.tsx"></script>`,
  '/src/main.tsx': `import React from 'react'
import { createRoot } from 'react-dom/client'
import App from '../App'
import './styles.css'

createRoot(document.getElementById('root')!).render(<App />)`,
  '/src/styles.css': `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

* { box-sizing: border-box; }
body { margin: 0; font-family: 'Space Grotesk', sans-serif; background: #0A0A0A; }
button, textarea, input { font: inherit; }
`
}
