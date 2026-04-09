import Link from 'next/link'

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for exploring and side projects.',
    features: [
      '3 projects',
      '10K monthly views',
      'Basic analytics',
      'Community support',
      'Holy Store listing',
    ],
    cta: 'Start free',
    href: '/register',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    description: 'For serious builders and indie creators.',
    features: [
      'Unlimited projects',
      '500K monthly views',
      'Advanced analytics',
      'Ad revenue share (70%)',
      'Priority deployments',
      'Custom domains',
      'HOL token rewards',
    ],
    cta: 'Get Pro',
    href: '/register?plan=pro',
    highlight: true,
  },
  {
    name: 'Teams',
    price: '$49',
    period: '/month',
    description: 'Scale your studio across multiple builders.',
    features: [
      'Everything in Pro',
      'Up to 10 team members',
      'Shared project workspace',
      'Priority support',
      'Revenue dashboard',
      'SLA guarantee',
    ],
    cta: 'Contact sales',
    href: 'mailto:sales@holysticlabs.com',
    highlight: false,
  },
]

export function PricingCards() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map(({ name, price, period, description, features, cta, href, highlight }) => (
            <div
              key={name}
              className={`rounded-xl border p-6 flex flex-col gap-4 ${
                highlight
                  ? 'border-[#7C3AED] bg-[#7C3AED]/10 shadow-lg shadow-[#7C3AED]/10'
                  : 'border-[#27272A] bg-[#18181B]'
              }`}
            >
              {highlight && (
                <span className="text-xs font-semibold text-[#7C3AED] uppercase tracking-wide">
                  Most Popular
                </span>
              )}
              <div>
                <h3 className="text-xl font-bold">{name}</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-bold">{price}</span>
                  <span className="text-[#A1A1AA] text-sm">{period}</span>
                </div>
                <p className="text-sm text-[#A1A1AA] mt-2">{description}</p>
              </div>
              <ul className="space-y-2 flex-1">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <span className="text-[#10B981]">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={href}
                className={`block text-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                  highlight
                    ? 'bg-[#7C3AED] text-white hover:bg-[#6D28D9]'
                    : 'border border-[#27272A] hover:bg-[#27272A]'
                }`}
              >
                {cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
