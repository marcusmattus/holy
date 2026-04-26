export type SettlementTransfer = {
  to: string
  amount: bigint
  currency: 'USDC' | 'POINTS'
  metadata?: Record<string, unknown>
}

export type SettlementReceipt = {
  provider: string
  txHash?: string
  status: 'SIMULATED' | 'SUBMITTED' | 'CONFIRMED' | 'FAILED'
}

export interface SettlementProvider {
  settleReward(transfer: SettlementTransfer): Promise<SettlementReceipt>
}

export class SimulatedSettlementProvider implements SettlementProvider {
  async settleReward(_transfer: SettlementTransfer): Promise<SettlementReceipt> {
    return {
      provider: 'simulated',
      status: 'SIMULATED',
    }
  }
}

export const settlementProvider = new SimulatedSettlementProvider()
