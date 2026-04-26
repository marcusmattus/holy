type QaIssue = { level: 'warn' | 'fail'; message: string }

const dangerousPatterns = [
  /postinstall.*(curl|wget|rm\s+-rf)/i,
  /process\.env\.[A-Z0-9_]{8,}/,
  /(wallet recovery phrase|seed phrase|password reset urgently)/i,
]

export function runSecurityCheck(files: Record<string, string>) {
  const issues: QaIssue[] = []

  for (const [path, content] of Object.entries(files)) {
    for (const pattern of dangerousPatterns) {
      if (pattern.test(content)) {
        issues.push({
          level: pattern === dangerousPatterns[0] ? 'fail' : 'warn',
          message: `Potential security issue in ${path}`,
        })
      }
    }
  }

  return issues
}
