import { CommandCenter } from '@/features/admin/command-center/CommandCenter'
import { headers } from 'next/headers'

export default async function CommandCenterPage() {
  const requestHeaders = await headers()
  const role = requestHeaders.get('x-user-role') ?? 'member'
  if (role !== 'admin') {
    return <main className="min-h-screen bg-[#0A0A0A] p-6 text-white">Admin access required.</main>
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] p-6 text-white font-['Space_Grotesk']">
      <h1 className="mb-4 text-2xl text-[#C9A24A]">Global Admin Command Center</h1>
      <CommandCenter />
    </main>
  )
}
