import { AppCard } from './app-card'

const APPS = [
  {
    id: '1',
    slug: 'analytics-pro',
    name: 'Analytics Pro',
    description:
      'Advanced analytics dashboard with real-time data, heatmaps, and conversion funnels.',
    author: 'DataTeam',
    price: 29,
    rating: 4.8,
    downloads: 2340,
    category: 'Analytics',
  },
  {
    id: '2',
    slug: 'commerce-kit',
    name: 'Commerce Kit',
    description:
      'Full-featured e-commerce starter with cart, checkout, and inventory management.',
    author: 'ShopBuilders',
    price: 49,
    rating: 4.6,
    downloads: 1820,
    category: 'Commerce',
  },
  {
    id: '3',
    slug: 'auth-module',
    name: 'Auth Module',
    description:
      'Plug-and-play authentication with social login, 2FA, and role management.',
    author: 'SecureDevs',
    price: 19,
    rating: 4.9,
    downloads: 4100,
    category: 'Auth',
  },
  {
    id: '4',
    slug: 'blog-engine',
    name: 'Blog Engine',
    description:
      'MDX-powered blog with SEO, RSS, and tag-based filtering built in.',
    author: 'ContentCo',
    price: 0,
    rating: 4.5,
    downloads: 5200,
    category: 'Content',
  },
  {
    id: '5',
    slug: 'forms-builder',
    name: 'Forms Builder',
    description:
      'Drag-and-drop form builder with validation, conditional logic, and integrations.',
    author: 'FormLabs',
    price: 39,
    rating: 4.7,
    downloads: 980,
    category: 'Productivity',
  },
  {
    id: '6',
    slug: 'crm-lite',
    name: 'CRM Lite',
    description:
      'Lightweight CRM with contacts, pipelines, and email sequences.',
    author: 'RevOps',
    price: 59,
    rating: 4.4,
    downloads: 730,
    category: 'Business',
  },
]

export function AppGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {APPS.map((app) => (
        <AppCard key={app.id} {...app} />
      ))}
    </div>
  )
}
