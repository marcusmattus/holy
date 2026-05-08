import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') ?? 'dev-user'

    const user = await prisma.user.findFirst({ where: { id: userId } })
    if (!user) return NextResponse.json({ scenarios: [] })

    const scenarios = await prisma.revenueScenario.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json({ scenarios })
  } catch (error) {
    console.error('Scenarios fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch scenarios' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      name,
      monthlyVisitors,
      conversionRate,
      avgOrderValue,
      revenueSharePct,
      monthlyRevenue,
      annualRevenue,
      projectId,
    } = body

    if (!userId || !name) {
      return NextResponse.json({ error: 'userId and name are required' }, { status: 400 })
    }

    // Ensure user exists for dev convenience
    let user = await prisma.user.findFirst({ where: { id: userId } })
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          email: `${userId}@holy.dev`,
          holyosUserId: `holyos_${userId}`,
        },
      })
    }

    const scenario = await prisma.revenueScenario.create({
      data: {
        userId,
        projectId: projectId ?? null,
        name,
        monthlyVisitors: monthlyVisitors ?? 1000,
        conversionRate: conversionRate ?? 2.0,
        avgOrderValue: avgOrderValue ?? 49,
        revenueSharePct: revenueSharePct ?? 15,
        monthlyRevenue: monthlyRevenue ?? 0,
        annualRevenue: annualRevenue ?? 0,
      },
    })

    return NextResponse.json({ scenario }, { status: 201 })
  } catch (error) {
    console.error('Scenario create error:', error)
    return NextResponse.json({ error: 'Failed to save scenario' }, { status: 500 })
  }
}
