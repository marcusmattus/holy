type Env = {
  OPENAI_API_KEY?: string
  ANTHROPIC_API_KEY?: string
  GITHUB_TOKEN?: string
  REDIS_URL?: string
}

let envCache: Env | null = null

export function getEnv(): Env {
  if (envCache) {
    return envCache
  }

  envCache = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    REDIS_URL: process.env.REDIS_URL,
  }

  return envCache
}

export function assertAtLeastOneLLMProvider(): void {
  const env = getEnv()

  if (!env.OPENAI_API_KEY && !env.ANTHROPIC_API_KEY && !env.GITHUB_TOKEN) {
    throw new Error(
      'Missing LLM credentials. Set OPENAI_API_KEY, ANTHROPIC_API_KEY, or GITHUB_TOKEN.',
    )
  }
}
