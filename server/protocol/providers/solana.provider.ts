import type {
  ProtocolProvider,
  SettlementInput,
  SettlementResult,
} from '@/server/protocol/protocol-provider'

export class SolanaProtocolProvider implements ProtocolProvider {
  async settle(_input: SettlementInput): Promise<SettlementResult> {
    return {
      provider: 'solana',
      status: 'PENDING',
      message: 'Solana settlement provider placeholder. Not active by default.',
    }
  }
}
