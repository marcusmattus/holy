import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  VERCEL_TOKEN: z.string().min(1).optional(),
  VERCEL_TEAM_ID: z.string().min(1).optional(),
  VERCEL_PROJECT_ID: z.string().min(1).optional(),
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
  CRON_SECRET: z.string().min(1).optional(),
})

export type ValidatedEnv = z.infer<typeof envSchema>

let cachedEnv: ValidatedEnv | null = null

export function getEnv() {
  if (!cachedEnv) {
    cachedEnv = envSchema.parse(process.env)
  }
  return cachedEnv
}

export function requireEnv<K extends keyof ValidatedEnv>(keys: K[]) {
  const env = getEnv()
  const values = {} as Record<K, string>

  for (const key of keys) {
    const value = env[key]
    if (!value) {
      throw new Error(`Missing required environment variable: ${String(key)}`)
    }
    values[key] = value
  }

  return values
}
