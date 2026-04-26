import { getProjectFileMap } from './project-file.service'
import path from 'path'

type CheckResult = {
  name: string
  status: 'PASS' | 'WARN' | 'FAIL'
  message: string
}

const REQUIRED_FILES = ['/package.json']

function detectBrokenImports(files: Record<string, string>) {
  const paths = new Set(Object.keys(files))
  let broken = 0

  for (const [filePath, content] of Object.entries(files)) {
    const importMatches = content.matchAll(/from\s+['\"]([^'\"]+)['\"]/g)
    for (const match of importMatches) {
      const source = match[1]
      if (!source.startsWith('.')) {
        continue
      }

      const baseDir = path.posix.dirname(filePath)
      const resolved = path.posix.normalize(path.posix.resolve(baseDir, source))
      const variants = [resolved, `${resolved}.ts`, `${resolved}.tsx`, `${resolved}/index.tsx`]

      if (!variants.some((variant) => paths.has(variant))) {
        broken += 1
      }
    }
  }

  return broken
}

export async function runProjectQa(projectId: string) {
  const files = await getProjectFileMap(projectId)
  const checks: CheckResult[] = []

  const missingRequired = REQUIRED_FILES.filter((file) => !files[file])
  checks.push({
    name: 'Required files',
    status: missingRequired.length === 0 ? 'PASS' : 'FAIL',
    message:
      missingRequired.length === 0
        ? 'Required files are present'
        : `Missing: ${missingRequired.join(', ')}`,
  })

  let packageJsonValid = false
  let packageScripts: Record<string, string> = {}
  if (files['/package.json']) {
    try {
      const pkg = JSON.parse(files['/package.json']) as { scripts?: Record<string, string> }
      packageScripts = pkg.scripts ?? {}
      packageJsonValid = true
    } catch {
      packageJsonValid = false
    }
  }

  checks.push({
    name: 'package.json validity',
    status: packageJsonValid ? 'PASS' : 'FAIL',
    message: packageJsonValid ? 'package.json parses successfully' : 'package.json is invalid JSON',
  })

  const fullContent = Object.values(files).join('\n')
  const secretLeak =
    /(api[_-]?key|secret|token|password)\s*[:=]\s*['"`][^'"`]{8,}['"`]/i.test(fullContent) ||
    /AKIA[0-9A-Z]{16}/.test(fullContent) ||
    /-----BEGIN (RSA|EC|OPENSSH|DSA) PRIVATE KEY-----/.test(fullContent)
  checks.push({
    name: 'Secret leakage',
    status: secretLeak ? 'FAIL' : 'PASS',
    message: secretLeak ? 'Potential hardcoded secret detected' : 'No obvious hardcoded secrets found',
  })

  const dangerousScript = Object.values(packageScripts).some((script) =>
    /(rm\s+-rf\s+\/|curl\s+.*\|\s*sh|wget\s+.*\|\s*sh)/i.test(script),
  )
  checks.push({
    name: 'Dangerous scripts',
    status: dangerousScript ? 'FAIL' : 'PASS',
    message: dangerousScript
      ? 'Potentially dangerous script command found'
      : 'No dangerous scripts detected',
  })

  const hasImgWithoutAlt =
    /<img\b(?![^>]*\balt\s*=\s*['"][^'"]+['"])[^>]*>/i.test(fullContent)
  checks.push({
    name: 'Accessibility hints',
    status: hasImgWithoutAlt ? 'WARN' : 'PASS',
    message: hasImgWithoutAlt ? 'Image tags may be missing alt text' : 'No obvious accessibility issues found',
  })

  const hasViewport = /name=['\"]viewport['\"]/i.test(fullContent)
  checks.push({
    name: 'Mobile responsiveness hints',
    status: hasViewport ? 'PASS' : 'WARN',
    message: hasViewport
      ? 'Viewport metadata detected'
      : 'Add viewport metadata and responsive classes where relevant',
  })

  const brokenImports = detectBrokenImports(files)
  checks.push({
    name: 'Broken import detection',
    status: brokenImports === 0 ? 'PASS' : 'WARN',
    message: brokenImports === 0 ? 'No broken local imports detected' : `${brokenImports} possible broken local imports`,
  })

  const overallStatus = checks.some((check) => check.status === 'FAIL')
    ? 'FAIL'
    : checks.some((check) => check.status === 'WARN')
      ? 'WARN'
      : 'PASS'

  return {
    status: overallStatus,
    checks,
  }
}
