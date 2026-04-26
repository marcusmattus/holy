import { CommandCenter } from '@/features/admin/command-center/CommandCenter'
import { headers } from 'next/headers'
import { assertAdminHeaders } from '@/server/security'

export default async function CommandCenterPage() {
  try {
    assertAdminHeaders(await headers())
  } catch {
    return <main className="min-h-screen bg-[#0A0A0A] p-6 text-white">Admin access required.</main>
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] p-6 text-white font-['Space_Grotesk']">
      <h1 className="mb-4 text-2xl text-[#C9A24A]">Global Admin Command Center</h1>
      <CommandCenter />
    </main>
  )
}
