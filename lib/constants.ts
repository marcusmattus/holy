export const BRAND = {
  name: 'Holy',
  company: 'Holystic Labs',
  tagline: 'The vibecoding platform',
  url: 'https://holy.holysticlabs.com',
  docsUrl: 'https://docs.holysticlabs.com',
  colors: {
    holyPurple: '#7C3AED',
    cosmicBlue: '#2563EB',
    neonEmerald: '#10B981',
    deepVoid: '#0A0A0F',
    surface: '#18181B',
    border: '#27272A',
    softHalo: '#F8FAFC',
    textSecondary: '#A1A1AA',
  },
} as const

export const API_BASE =
  process.env.NEXT_PUBLIC_HOLYOS_API_URL ?? 'https://api.holyos.io'

export const PLANS = ['free', 'pro', 'teams'] as const
export type Plan = (typeof PLANS)[number]
