export function EcosystemBar() {
  return (
    <section
      id="ecosystem"
      className="py-20 px-4 border-y border-[#27272A] bg-[#0F0F14]"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">The Holy Ecosystem</h2>
          <p className="text-[#A1A1AA]">Three layers. One coherent platform.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Holy',
              tagline: 'The vibecoding platform',
              desc: 'Where builders create, ship, and monetize. Your product interface.',
              color: '#7C3AED',
              border: 'border-[#7C3AED]/40',
            },
            {
              name: 'HolyOS',
              tagline: 'The platform operating system',
              desc: 'Runtime, analytics, rewards, deployments, and the API layer for all Holy products.',
              color: '#2563EB',
              border: 'border-[#2563EB]/40',
            },
            {
              name: 'Holystic Labs',
              tagline: 'The company',
              desc: 'Building the future of software creation. We make tools that make builders.',
              color: '#10B981',
              border: 'border-[#10B981]/40',
            },
          ].map(({ name, tagline, desc, color, border }) => (
            <div
              key={name}
              className={`rounded-xl border ${border} bg-[#18181B] p-6`}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: color }}
                />
                <span className="font-bold">{name}</span>
              </div>
              <p className="text-sm font-medium mb-2" style={{ color }}>
                {tagline}
              </p>
              <p className="text-sm text-[#A1A1AA] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
