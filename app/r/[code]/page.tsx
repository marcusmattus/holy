import { redirect } from 'next/navigation'
import { resolveReferral } from '@/server/services/growth.service'

export default async function ReferralRedirectPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const referral = await resolveReferral(code).catch(() => null)

  if (!referral) {
    redirect('/store')
  }

  if (referral.listing?.slug) {
    redirect(`/store/${referral.listing.slug}?ref=${referral.code}`)
  }

  redirect('/store')
}
