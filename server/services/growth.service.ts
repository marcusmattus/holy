import { randomBytes } from 'node:crypto'
import { prisma } from '@/server/db/client'
import { trackEvent } from './analytics.service'

function generateCode() {
  return randomBytes(6).toString('base64url').toLowerCase()
}

async function createUniqueReferral(input: { referrerId: string; listingId?: string }) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      return await prisma.referral.create({
        data: {
          referrerId: input.referrerId,
          listingId: input.listingId,
          code: generateCode(),
        },
      })
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code?: string }).code === 'P2002'
      ) {
        continue
      }
      throw error
    }
  }

  throw new Error('Unable to generate a unique referral code')
}

export async function createReferralLink(input: {
  referrerId: string
  listingId?: string
}) {
  const referral = await createUniqueReferral(input)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  return {
    referral,
    url: `${appUrl}/r/${referral.code}`,
  }
}

export async function resolveReferral(code: string) {
  const referral = await prisma.referral.findUniqueOrThrow({
    where: { code },
    include: { listing: true },
  })

  await trackEvent({
    listingId: referral.listingId ?? undefined,
    eventName: 'REFERRAL_CLICKED',
    metadata: { code },
  })

  return referral
}
