import { NextResponse } from 'next/server'
import { CertificationLevel } from '@prisma/client'
import { reviewPluginCertification } from '@/server/services/plugin-certification.service'
import { assertAdmin } from '@/server/security'

export async function POST(request: Request) {
  try {
    const identity = assertAdmin(request)
    const body = (await request.json()) as {
      certificationId: string
      approve: boolean
      level?: CertificationLevel
    }

    const result = await reviewPluginCertification({
      certificationId: body.certificationId,
      reviewerId: identity.userId,
      approve: body.approve,
      level: body.level,
    })

    return NextResponse.json({ certification: result })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Certification review failed' }, { status: 400 })
  }
}
