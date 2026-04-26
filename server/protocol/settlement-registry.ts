import {
  type SettlementMode,
  type SettlementProvider,
} from '@/server/protocol/providers/base-usdc.provider'
import { SolanaUsdcProvider } from '@/server/protocol/providers/solana-usdc.provider'

const providers = new Map<string, SettlementProvider>([
  ['solana-usdc', new SolanaUsdcProvider()],
])

export function getSettlementProvider(providerId: string) {
  const provider = providers.get(providerId)
  if (!provider) throw new Error('UNSUPPORTED_SETTLEMENT_PROVIDER')
  return provider
}

export function getSettlementMode(): SettlementMode {
  const mode = process.env.SETTLEMENT_MODE ?? 'DISABLED'
  if (mode === 'LIVE' || mode === 'SIMULATED') return mode
  if (mode !== 'DISABLED') {
    console.warn(`Invalid SETTLEMENT_MODE "${mode}", defaulting to DISABLED`)
  }
  return 'DISABLED'
}
