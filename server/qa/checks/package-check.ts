type QaIssue = { level: 'warn' | 'fail'; message: string }

export function runPackageCheck(files: Record<string, string>) {
  const issues: QaIssue[] = []
  const packageJson = files['/package.json'] ?? files['package.json']

  if (!packageJson) {
    issues.push({ level: 'fail', message: 'Missing package.json' })
    return issues
  }

  try {
    const parsed = JSON.parse(packageJson) as { scripts?: Record<string, string> }
    const scripts = parsed.scripts ?? {}
    for (const [name, script] of Object.entries(scripts)) {
      if (/postinstall.*(curl|wget|rm\s+-rf)/i.test(script)) {
        issues.push({ level: 'fail', message: `Dangerous script "${name}" detected` })
      }
    }
  } catch {
    issues.push({ level: 'fail', message: 'Invalid package.json format' })
  }

  return issues
}
