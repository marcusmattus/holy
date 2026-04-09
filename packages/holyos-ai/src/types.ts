export interface HolyAIConfig {
  apiKey?: string
  model?: string
}

export interface VibecodeInput {
  prompt: string
  framework?: 'react' | 'nextjs' | 'vue'
  style?: string
}

export interface VibecodeResult {
  code: string
  language: string
  componentName: string
  dependencies: string[]
}

export interface ScaffoldInput {
  projectName: string
  description: string
  features: string[]
}

export interface ScaffoldResult {
  files: Array<{ path: string; content: string }>
  commands: string[]
}

export interface AnalyticsInsightInput {
  metrics: {
    views: number
    visitors: number
    revenue: number
    bounceRate: number
  }
  period: string
}

export interface AnalyticsInsightResult {
  summary: string
  recommendations: string[]
  trends: Array<{ metric: string; trend: 'up' | 'down' | 'stable'; change: number }>
}
