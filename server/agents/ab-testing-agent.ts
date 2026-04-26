export function proposeABExperiment(input: {
  entityName: string
  baselineMetric: string
}) {
  return {
    name: `${input.entityName} conversion experiment`,
    hypothesis: `Changing ${input.entityName} may improve ${input.baselineMetric}, but results are not guaranteed.`,
    variants: {
      control: { label: 'Current' },
      variantA: { label: 'AI proposal A' },
      variantB: { label: 'AI proposal B' },
    },
    requiresApproval: true,
    disclaimer:
      'This is a suggestion only. Launch requires user approval and does not guarantee performance outcomes.',
  }
}
