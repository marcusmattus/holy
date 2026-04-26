import type {
  ProtocolProvider,
  SettlementInput,
  SettlementResult,
} from '@/server/protocol/protocol-provider'

export class BaseProtocolProvider implements ProtocolProvider {
  async settle(_input: SettlementInput): Promise<SettlementResult> {
    return {
      provider: 'base',
      status: 'PENDING',
      message: 'Base settlement provider placeholder. Not active by default.',
    }
  }
}
