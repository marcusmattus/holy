import { NextResponse } from 'next/server'
import { listPublicStatus } from '@/server/services/public-status.service'

export async function GET() {
  return NextResponse.json(listPublicStatus())
}
