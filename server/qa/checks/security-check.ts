type QaIssue = { level: 'warn' | 'fail'; message: string }

const dangerousPatterns: Array<{ pattern: RegExp; level: 'warn' | 'fail' }> = [
  { pattern: /postinstall.*(curl|wget|rm\s+-rf)/i, level: 'fail' },
  // Heuristic for potential secret leakage/config exposure references in source text.
  { pattern: /process\.env\.[A-Z0-9_]{8,}/, level: 'warn' },
  { pattern: /(wallet recovery phrase|seed phrase|password reset urgently)/i, level: 'warn' },
]

export function runSecurityCheck(files: Record<string, string>) {
  const issues: QaIssue[] = []

  for (const [path, content] of Object.entries(files)) {
    for (const rule of dangerousPatterns) {
      if (rule.pattern.test(content)) {
        issues.push({
          level: rule.level,
          message: `Potential security issue in ${path}`,
        })
      }
    }
  }

  return issues
}
