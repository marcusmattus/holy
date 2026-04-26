import { phase18State } from '@/server/phase18/state'

export function listFederatedRecommendationBundles() {
  const acceptedUpdates = phase18State.federatedUpdates.filter((item) => item.accepted)
  const confidence = acceptedUpdates.length >= 3 ? 0.84 : 0.62
  return [
    {
      id: 'bundle-onboarding-pricing-referral',
      title: 'Onboarding + pricing experiment + referral agent',
      description:
        'Apps in this category often improve with onboarding checklist + pricing experiment + referral agent.',
      confidence,
      paidAssetsIncluded: true,
      claims: 'No guaranteed outcomes. Results vary by implementation and market fit.',
    },
    {
      id: 'bundle-template-plugin-qa',
      title: 'Template + plugin + QA workflow pairing',
      description: 'This template type often pairs well with these plugins and QA workflows.',
      confidence: confidence - 0.08,
      paidAssetsIncluded: false,
      claims: 'Recommendations are anonymized, thresholded, and informational only.',
    },
  ]
}
