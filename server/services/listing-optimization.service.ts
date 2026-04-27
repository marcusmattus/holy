import type { StoreListingView } from './store-listing.service'

type ListingOptimizationResult = {
  improvedTitle: string
  improvedDescription: string
  suggestedCategory: string
  pricingSuggestion: string
  conversionSuggestions: string[]
}

export function optimizeListing(listing: StoreListingView): ListingOptimizationResult {
  const conversionRate = listing.views > 0 ? listing.installs / listing.views : 0
  const conversionPercent = (conversionRate * 100).toFixed(1)
  const suggestedCategory =
    listing.category === 'General' ? 'Productivity' : listing.category

  const pricingSuggestion =
    listing.price <= 0
      ? 'Test a low introductory paid tier (£9-£19) after gathering install intent.'
      : conversionRate < 0.05
        ? 'Consider testing a lower entry price or adding a free trial to increase conversion.'
        : 'Current pricing appears reasonable; test value-framed bundles for higher average order value.'

  return {
    improvedTitle: `${listing.title} — Fast setup for ${listing.category.toLowerCase()} teams`,
    improvedDescription: `${listing.description} Optimized onboarding, clearer outcomes, and a guided setup flow can improve install intent and activation.`,
    suggestedCategory,
    pricingSuggestion,
    conversionSuggestions: [
      `Current conversion is ${conversionPercent}%. Highlight outcomes in the first sentence.`,
      'Add social proof (ratings, install count, creator credibility) above the fold.',
      'Use a short feature checklist with concrete benefits and activation steps.',
      'Test CTA copy variants for install vs. buy intent with referral-aware tracking.',
    ],
  }
}
