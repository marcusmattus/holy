import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import crypto from 'crypto'
import SystemHealthDashboard from '@/features/admin/components/SystemHealthDashboard'

export const metadata = { title: 'Monitoring — Holy Admin' }

export default async function MonitoringPage() {
  const headerStore = await headers()
  const adminToken = process.env.HOLY_ADMIN_TOKEN
  const bearerToken = headerStore.get('authorization')?.replace(/^Bearer\s+/i, '')

  const validToken =
    !!adminToken &&
    !!bearerToken &&
    adminToken.length === bearerToken.length &&
    crypto.timingSafeEqual(Buffer.from(adminToken), Buffer.from(bearerToken))

  if (!validToken) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6 space-y-4">
      <p className="text-[10px] uppercase tracking-wider text-[#C9A24A]">Admin only</p>
      <h1 className="text-2xl font-semibold">System monitoring</h1>
      <SystemHealthDashboard />
    </div>
  )
}
