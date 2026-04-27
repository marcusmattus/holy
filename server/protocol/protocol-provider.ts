export type SettlementInput = {
  ledgerId: string
  amountCents: number
  currency: string
}

export type SettlementResult = {
  provider: string
  status: 'simulated' | 'submitted' | 'failed'
  txHash?: string
}

export interface ProtocolProvider {
  settle(input: SettlementInput): Promise<SettlementResult>
}

class SimulatedProtocolProvider implements ProtocolProvider {
  async settle(input: SettlementInput): Promise<SettlementResult> {
    return {
      provider: 'simulated',
      status: 'simulated',
      txHash: `sim_${input.ledgerId}`,
    }
  }
}

export function getProtocolProvider(): ProtocolProvider {
  return new SimulatedProtocolProvider()
}
