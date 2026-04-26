import { QaRunStatus } from '@prisma/client'
import { prisma } from '@/server/db/prisma'
import { runAccessibilityCheck } from '@/server/qa/checks/accessibility-check'
import { runPackageCheck } from '@/server/qa/checks/package-check'
import { runPerformanceCheck } from '@/server/qa/checks/performance-check'
import { runSecurityCheck } from '@/server/qa/checks/security-check'

type QaIssue = { level: 'warn' | 'fail'; message: string }

export async function runQaPipeline(projectId: string, files: Record<string, string>) {
  const issues: QaIssue[] = [
    ...runPackageCheck(files),
    ...runSecurityCheck(files),
    ...runAccessibilityCheck(files),
    ...runPerformanceCheck(files),
  ]

  const status = issues.some((issue) => issue.level === 'fail')
    ? QaRunStatus.FAIL
    : issues.length > 0
      ? QaRunStatus.WARN
      : QaRunStatus.PASS

  const qaRun = await prisma.qaRun.create({
    data: {
      projectId,
      status,
      results: {
        issues,
        checkedAt: new Date().toISOString(),
      },
    },
  })

  return qaRun
}
