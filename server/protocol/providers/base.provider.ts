import type { ProtocolProvider, SettlementInput, SettlementResult } from '../protocol-provider'

export class BaseProtocolProvider implements ProtocolProvider {
  async settle(_input: SettlementInput): Promise<SettlementResult> {
    return {
      provider: 'base',
      status: 'failed',
    }
  }
}
