export type GrowthAgentInput = {
  conversionRate?: number
  bounceRate?: number
  priceCents?: number
}

export function generateGrowthSuggestions(input: GrowthAgentInput) {
  const suggestions: Array<{
    type: 'UX' | 'REFERRAL' | 'PERFORMANCE'
    title: string
    description: string
  }> = []

  if ((input.bounceRate ?? 0) > 0.6) {
    suggestions.push({
      type: 'UX',
      title: 'Reduce first-screen friction',
      description: 'Simplify hero CTA copy and shorten onboarding to improve early retention.',
    })
  }

  if ((input.conversionRate ?? 0) < 0.03) {
    suggestions.push({
      type: 'REFERRAL',
      title: 'Add referral incentive prompt',
      description: 'Introduce referral sharing after successful publish to grow acquisition.',
    })
  }

  if ((input.priceCents ?? 0) > 5000) {
    suggestions.push({
      type: 'PERFORMANCE',
      title: 'Improve value communication',
      description: 'Highlight proof points and include side-by-side feature comparison near pricing.',
    })
  }

  return suggestions
}
