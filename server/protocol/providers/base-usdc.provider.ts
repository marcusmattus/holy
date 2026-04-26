export type SettlementMode = 'DISABLED' | 'SIMULATED' | 'LIVE'

export type SettlementPreviewInput = {
  amount: number
  currency: string
  recipient: string
}

export type SettlementPreview = {
  provider: string
  mode: SettlementMode
  amount: number
  currency: string
  networkFee: number
  recipient: string
}

export type SettlementSubmitResult = {
  provider: string
  mode: SettlementMode
  submitted: boolean
  txHash?: string
}

export interface SettlementProvider {
  id: string
  preview(input: SettlementPreviewInput, mode: SettlementMode): Promise<SettlementPreview>
  submit(input: SettlementPreviewInput, mode: SettlementMode): Promise<SettlementSubmitResult>
}
