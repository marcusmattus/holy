import { NextResponse } from 'next/server'
import { runExportJob } from '@/server/services/export-job.service'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ exportJobId: string }> },
) {
  const { exportJobId } = await params
  const result = await runExportJob(exportJobId)
  return NextResponse.json(result)
}
