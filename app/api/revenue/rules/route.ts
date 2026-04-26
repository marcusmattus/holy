import { NextResponse } from 'next/server'
import type { RevenueShareRole } from '@prisma/client'
import { prisma } from '@/server/db/client'
import { ensureDefaultRevenueRules } from '@/server/services/revenue-share.service'

const ALLOWED_ROLES: RevenueShareRole[] = [
  'CREATOR',
  'COLLABORATOR',
  'REFERRER',
  'PLATFORM',
]

type IncomingRule = {
  recipientId: string
  role: string
  basisPoints: number
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const listingId = searchParams.get('listingId')

  if (!listingId) {
    return NextResponse.json({ error: 'Missing listingId' }, { status: 400 })
  }

  const listing = await prisma.storeListing.findUnique({
    where: { id: listingId },
    include: { project: true },
  })

  if (!listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }

  const rules = await ensureDefaultRevenueRules({
    listingId,
    creatorId: listing.project.userId,
  })

  return NextResponse.json({ rules })
}

export async function POST(req: Request) {
  const body = await req.json()
  const listingId = typeof body?.listingId === 'string' ? body.listingId : ''
  const rules = Array.isArray(body?.rules) ? body.rules : []

  if (!listingId) {
    return NextResponse.json({ error: 'Missing listingId' }, { status: 400 })
  }

  const parsedRules: IncomingRule[] = rules
    .map((rule: unknown) => {
      const incoming = rule as {
        recipientId?: unknown
        role?: unknown
        basisPoints?: unknown
      }

      return {
        recipientId:
          typeof incoming.recipientId === 'string' ? incoming.recipientId : '',
        role: typeof incoming.role === 'string' ? incoming.role : '',
        basisPoints: Number(incoming.basisPoints),
      }
    })
    .filter(
      (rule: IncomingRule) =>
        rule.recipientId &&
        ALLOWED_ROLES.includes(rule.role as RevenueShareRole) &&
        Number.isFinite(rule.basisPoints) &&
        rule.basisPoints >= 0
    )

  const totalBps = parsedRules.reduce((sum, rule) => sum + rule.basisPoints, 0)
  if (totalBps > 10000) {
    return NextResponse.json(
      { error: 'Revenue share basis points cannot exceed 10000' },
      { status: 400 }
    )
  }

  const updated = await prisma.$transaction(async (tx) => {
    await tx.revenueShareRule.deleteMany({ where: { listingId } })

    if (parsedRules.length === 0) {
      const listing = await tx.storeListing.findUniqueOrThrow({
        where: { id: listingId },
        include: { project: true },
      })
      return Promise.all([
        tx.revenueShareRule.create({
          data: {
            listingId,
            recipientId: listing.project.userId,
            role: 'CREATOR',
            basisPoints: 8500,
          },
        }),
        tx.revenueShareRule.create({
          data: {
            listingId,
            recipientId: listing.project.userId,
            role: 'PLATFORM',
            basisPoints: 1500,
          },
        }),
      ])
    }

    return Promise.all(
      parsedRules.map((rule: IncomingRule) =>
        tx.revenueShareRule.create({
          data: {
            listingId,
            recipientId: rule.recipientId,
            role: rule.role as RevenueShareRole,
            basisPoints: rule.basisPoints,
          },
        })
      )
    )
  })

  return NextResponse.json({ rules: updated })
}
