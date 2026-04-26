import { NextResponse } from 'next/server'
import {
  SETTLEMENT_MAX_BATCH_CENTS,
  canRunSettlementPilot,
} from '@/server/protocol/settlement-policy'
import { writeSettlementAuditLog } from '@/server/protocol/settlement-audit'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const enabled = process.env.SETTLEMENT_PILOT_ENABLED === 'true'
    if (!enabled) {
      await writeSettlementAuditLog({
        action: 'settlement_pilot_blocked',
        actorId: body.actorId,
        payload: { reason: 'pilot_disabled' },
      })
      return NextResponse.json(
        { allowed: false, reason: 'Settlement pilot is disabled by default' },
        { status: 403 },
      )
    }

    const policy = await canRunSettlementPilot({
      providerId: body.providerId,
      adminApproved: body.adminApproved === true,
      creatorOptIn: body.creatorOptIn === true,
    })
    if (!policy.allowed) {
      await writeSettlementAuditLog({
        action: 'settlement_pilot_denied',
        actorId: body.actorId,
        payload: policy,
      })
      return NextResponse.json(policy, { status: 403 })
    }

    const amountCents = Number(body.amountCents ?? 0)
    if (amountCents > SETTLEMENT_MAX_BATCH_CENTS) {
      return NextResponse.json(
        { allowed: false, reason: 'Batch exceeds settlement pilot limit' },
        { status: 400 },
      )
    }

    await writeSettlementAuditLog({
      action: 'settlement_pilot_previewed',
      actorId: body.actorId,
      payload: {
        providerId: body.providerId,
        amountCents,
        note: 'Ledger and Stripe remain source of truth',
      },
    })

    return NextResponse.json({
      allowed: true,
      preview: {
        amountCents,
        status: 'simulated',
        message: 'Pilot preview generated. No onchain settlement executed.',
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to run settlement pilot' },
      { status: 400 },
    )
  }
}
