type QaIssue = { level: 'warn' | 'fail'; message: string }

export function runAccessibilityCheck(files: Record<string, string>) {
  const issues: QaIssue[] = []
  const combined = Object.values(files).join('\n')

  if (/<button(?![^>]*aria-label)/i.test(combined)) {
    issues.push({ level: 'warn', message: 'Buttons should include aria-label where necessary.' })
  }
  if (!/<h1[\s>]/i.test(combined)) {
    issues.push({ level: 'warn', message: 'App should include a primary <h1> heading.' })
  }

  return issues
}
