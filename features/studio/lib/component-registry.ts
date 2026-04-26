import type { ComponentRegistryItem } from '../types'

export const defaultComponentRegistry: ComponentRegistryItem[] = [
  {
    id: 'hero',
    name: 'Hero Section',
    selector: '[data-holy-id="hero"]',
    filePath: '/App.tsx',
    description: 'Main landing page hero area',
  },
  {
    id: 'pricing',
    name: 'Pricing Cards',
    selector: '[data-holy-id="pricing"]',
    filePath: '/App.tsx',
    description: 'Pricing and monetization section',
  },
]
