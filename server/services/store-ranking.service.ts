import { prisma } from '@/server/db/client'

const SCORE_WEIGHT_VIEW = 1
const SCORE_WEIGHT_INSTALL = 5
const SCORE_WEIGHT_PURCHASE = 20
const SCORE_WEIGHT_REFERRAL_CLICK = 3

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
    const priceAmount = listing.price ?? 0
    const revenueCents = Math.round(priceAmount * purchases * 100)
    const score =
      views * SCORE_WEIGHT_VIEW +
      installs * SCORE_WEIGHT_INSTALL +
      purchases * SCORE_WEIGHT_PURCHASE +
      revenueCents / 100 +
      referralClicks * SCORE_WEIGHT_REFERRAL_CLICK

    return {
      ...listing,
      stats: { views, installs, purchases, referralClicks, revenueCents, score },
    }
  })

  return scored.sort((a, b) => b.stats.score - a.stats.score)
}
