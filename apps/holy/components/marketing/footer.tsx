import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-[#27272A] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-md bg-[#7C3AED] flex items-center justify-center text-white font-bold text-xs">
                H
              </div>
              <span className="font-semibold text-sm">Holy</span>
            </div>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              The vibecoding platform by Holystic Labs.
            </p>
          </div>
          {[
            {
              title: 'Product',
              links: [
                ['Features', '#features'],
                ['Pricing', '/pricing'],
                ['Store', '/dashboard/store'],
                ['Dashboard', '/dashboard'],
              ],
            },
            {
              title: 'Company',
              links: [
                ['About', '#'],
                ['Blog', '#'],
                ['Careers', '#'],
                ['Contact', '#'],
              ],
            },
            {
              title: 'Legal',
              links: [
                ['Privacy', '#'],
                ['Terms', '#'],
                ['Licenses', '#'],
              ],
            },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A1A1AA] mb-4">
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-[#A1A1AA] hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-[#27272A] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#A1A1AA]">
            © 2025 Holystic Labs. All rights reserved.
          </p>
          <p className="text-xs text-[#A1A1AA]">Built with Holy ✦</p>
        </div>
      </div>
    </footer>
  )
}
