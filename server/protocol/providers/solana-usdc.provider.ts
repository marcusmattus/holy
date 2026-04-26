import {
  type SettlementMode,
  type SettlementPreviewInput,
  type SettlementProvider,
} from '@/server/protocol/providers/base-usdc.provider'

export class SolanaUsdcProvider implements SettlementProvider {
  id = 'solana-usdc'

  async preview(input: SettlementPreviewInput, mode: SettlementMode) {
    return {
      provider: this.id,
      mode,
      amount: input.amount,
      currency: input.currency,
      networkFee: 0.01,
      recipient: input.recipient,
    }
  }

  async submit(input: SettlementPreviewInput, mode: SettlementMode) {
    if (mode !== 'LIVE') {
      return {
        provider: this.id,
        mode,
        submitted: false,
        txHash: `sim_${Date.now()}`,
      }
    }
    return {
      provider: this.id,
      mode,
      submitted: true,
      txHash: `0x${Buffer.from(JSON.stringify(input)).toString('hex').slice(0, 32)}`,
    }
  }
}
