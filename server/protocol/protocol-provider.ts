export type SettlementInput = {
  ledgerEntryId: string
  amountCents: number
  currency: string
  recipientReference: string
}

export type SettlementResult = {
  provider: 'simulated' | 'base' | 'solana'
  txHash?: string
  status: 'PENDING' | 'SETTLED' | 'FAILED'
  message?: string
}

export interface ProtocolProvider {
  settle(input: SettlementInput): Promise<SettlementResult>
}

class SimulatedProtocolProvider implements ProtocolProvider {
  async settle(input: SettlementInput): Promise<SettlementResult> {
    return {
      provider: 'simulated',
      txHash: `sim-${input.ledgerEntryId}`,
      status: 'SETTLED',
      message: 'Simulated settlement recorded. Ledger remains source of truth.',
    }
  }
}

export function getProtocolProvider(): ProtocolProvider {
  return new SimulatedProtocolProvider()
}
