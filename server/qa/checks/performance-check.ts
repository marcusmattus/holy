type QaIssue = { level: 'warn' | 'fail'; message: string }

export function runPerformanceCheck(files: Record<string, string>) {
  const issues: QaIssue[] = []

  for (const [path, content] of Object.entries(files)) {
    if (content.length > 500_000) {
      issues.push({ level: 'warn', message: `${path} is very large; consider splitting.` })
    }
    if (/<script[^>]+src=['"]https?:\/\//i.test(content)) {
      issues.push({ level: 'warn', message: `${path} loads remote scripts; verify trusted sources.` })
    }
  }

  return issues
}
