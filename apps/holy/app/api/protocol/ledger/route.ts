import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') ?? 'dev-user'

    // Ensure user exists (dev convenience)
    const user = await prisma.user.findFirst({ where: { id: userId } })

    if (!user) {
      return NextResponse.json({ ledger: [] })
    }

    const ledger = await prisma.rewardLedger.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    type LedgerEntry = (typeof ledger)[number]
    const summary = {
      claimableUsdc: ledger
        .filter((l: LedgerEntry) => l.status === 'PENDING')
        .reduce((s: number, l: LedgerEntry) => s + l.amountUsdc, 0),
      totalSettledUsdc: ledger
        .filter((l: LedgerEntry) => l.status === 'SETTLED')
        .reduce((s: number, l: LedgerEntry) => s + l.amountUsdc, 0),
      totalHol: ledger.reduce((s: number, l: LedgerEntry) => s + l.amountHol, 0),
    }

    return NextResponse.json({ ledger, summary })
  } catch (error) {
    console.error('Ledger fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch ledger' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type, amountUsdc, amountHol, description, projectId, txHash } = body

    if (!userId || !type || amountUsdc == null) {
      return NextResponse.json({ error: 'userId, type, amountUsdc required' }, { status: 400 })
    }

    const entry = await prisma.rewardLedger.create({
      data: {
        userId,
        type,
        amountUsdc,
        amountHol: amountHol ?? 0,
        description,
        projectId,
        txHash,
        status: 'PENDING',
      },
    })

    return NextResponse.json({ entry }, { status: 201 })
  } catch (error) {
    console.error('Ledger create error:', error)
    return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 })
  }
}
