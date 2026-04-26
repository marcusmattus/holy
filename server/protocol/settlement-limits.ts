export const APPROVED_SETTLEMENT_PROVIDERS = new Set(['stripe', 'adyen'])
export const MAX_SETTLEMENT_BATCH_CENTS = Number(process.env.SETTLEMENT_MAX_BATCH_CENTS ?? 100_000)

export function assertSettlementLimits(input: {
  provider: string
  amountCents: number
  approved: boolean
  creatorOptIn: boolean
}) {
  if (!input.approved) {
    throw new Error('Settlement batch requires admin approval')
  }

  if (!input.creatorOptIn) {
    throw new Error('Creator must opt in before settlement')
  }

  if (!APPROVED_SETTLEMENT_PROVIDERS.has(input.provider)) {
    throw new Error('Settlement provider not approved')
  }

  if (input.amountCents > MAX_SETTLEMENT_BATCH_CENTS) {
    throw new Error('Settlement batch exceeds configured limit')
  }
}
