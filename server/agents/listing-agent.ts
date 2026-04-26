export function buildListingCopySuggestion(currentDescription: string) {
  return {
    type: 'LISTING_COPY' as const,
    title: 'Improve listing clarity',
    description: `Tighten opening value statement and add concrete outcomes. Current description length: ${currentDescription.length} chars.`,
  }
}
