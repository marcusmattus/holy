import { redirect } from 'next/navigation'
import { syncPayoutAccount } from '@/server/services/payout-account.service'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  if (userId) await syncPayoutAccount(userId)
  redirect('/dashboard/creator?payouts=connected')
}
