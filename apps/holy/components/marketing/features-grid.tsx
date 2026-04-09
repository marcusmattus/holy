const FEATURES = [
  {
    icon: '✦',
    title: 'Vibecoding Editor',
    description: 'Describe what you want in plain English. Holy AI generates production-ready React & Next.js code instantly.',
  },
  {
    icon: '��',
    title: 'Web App Store',
    description: 'Publish your apps to the Holy Store and earn revenue from every installation or subscription.',
  },
  {
    icon: '📊',
    title: 'Built-in Analytics',
    description: 'Real-time visitors, traffic charts, and conversion tracking — no third-party setup required.',
  },
  {
    icon: '💸',
    title: 'Revenue Engine',
    description: 'Monetize with ad zones, app sales, and subscriptions. Earnings settle on-chain in USDC.',
  },
  {
    icon: '⚡',
    title: 'HolyOS Runtime',
    description: 'Deploy on HolyOS for instant global edge deployment, auto-scaling, and zero-downtime builds.',
  },
  {
    icon: '🔗',
    title: 'On-chain Rewards',
    description: 'Earn HOL tokens for creating popular apps. Claim USDC rewards directly to your wallet.',
  },
]

export function FeaturesGrid() {
  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to ship</h2>
          <p className="text-[#A1A1AA] max-w-xl mx-auto">
            From idea to income in hours, not months. Holy gives you the full stack.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-[#27272A] bg-[#18181B] p-6 hover:border-[#7C3AED]/50 transition-colors"
            >
              <div className="text-2xl mb-3">{icon}</div>
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-sm text-[#A1A1AA] leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
