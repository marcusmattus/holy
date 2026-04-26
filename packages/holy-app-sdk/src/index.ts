import { getUser } from './auth'
import { track } from './analytics'
import { checkout } from './monetization'
import { getBalance } from './rewards'

export const holyApp = {
  auth: {
    getUser,
  },
  analytics: {
    track,
  },
  monetization: {
    checkout,
  },
  rewards: {
    getBalance,
  },
  env: {
    getPublicConfig() {
      return {
        appId: process.env.NEXT_PUBLIC_APP_ID ?? 'holy-app',
        apiBaseUrl: process.env.NEXT_PUBLIC_HOLYOS_API_URL ?? '/api',
      }
    },
  },
}

export type HolyAppSdk = typeof holyApp
