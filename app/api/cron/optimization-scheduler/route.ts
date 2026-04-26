import { NextResponse } from 'next/server'
import { runDueOptimizationSchedules } from '@/server/services/optimization-schedule.service'

export async function POST() {
  return NextResponse.json({ runs: runDueOptimizationSchedules() })
}
