import { prisma } from '@/server/db/client'

export async function getRankedListings() {
  const listings = await prisma.storeListing
    .findMany({
      where: { isPublished: true },
      include: {
        analyticsEvents: {
          where: {
            eventName: {
              in: [
                'STORE_VIEW',
                'INSTALL_COMPLETED',
                'PURCHASE_COMPLETED',
                'REFERRAL_CLICKED',
              ],
            },
          },
        },
      },
    })
    .catch(() => [])

  const scored = listings.map((listing) => {
    const views = listing.analyticsEvents.filter((e) => e.eventName === 'STORE_VIEW').length
    const installs = listing.analyticsEvents.filter((e) => e.eventName === 'INSTALL_COMPLETED').length
    const purchases = listing.analyticsEvents.filter((e) => e.eventName === 'PURCHASE_COMPLETED').length
    const referralClicks = listing.analyticsEvents.filter((e) => e.eventName === 'REFERRAL_CLICKED').length
    const revenueCents = Math.round((listing.price ?? 0) * 100) * purchases
    const score = views + installs * 5 + purchases * 20 + revenueCents / 100 + referralClicks * 3

    return {
      ...listing,
      stats: { views, installs, purchases, referralClicks, revenueCents, score },
    }
  })

  return scored.sort((a, b) => b.stats.score - a.stats.score)
}
