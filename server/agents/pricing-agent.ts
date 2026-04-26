export function buildPricingSuggestion(priceCents: number) {
  const target = priceCents > 3000 ? Math.round(priceCents * 0.9) : Math.round(priceCents * 1.1)
  return {
    type: 'PRICING' as const,
    title: 'Test alternative pricing',
    description: `Run an A/B test between current ${(priceCents / 100).toFixed(2)} and variant ${(target / 100).toFixed(2)}.`,
    patchJson: {
      suggestedPriceCents: target,
      confidence: 'medium',
    },
  }
}
