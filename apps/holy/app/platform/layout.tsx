import './platform.css'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Loading Platform...</h1>
            <p className="text-white/40">Please refresh if this persists</p>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}
