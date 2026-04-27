import type { ProtocolProvider, SettlementInput, SettlementResult } from '../protocol-provider'

export class SolanaProtocolProvider implements ProtocolProvider {
  async settle(_input: SettlementInput): Promise<SettlementResult> {
    return {
      provider: 'solana',
      status: 'failed',
    }
  }
}
