import { NextResponse } from 'next/server'
import { getDeployment } from '@/server/services/deployment.service'

export async function GET(
  _: Request,
  { params }: { params: Promise<{ deploymentId: string }> },
) {
  const { deploymentId } = await params
  const deployment = await getDeployment(deploymentId)
  return NextResponse.json({ deployment })
}
