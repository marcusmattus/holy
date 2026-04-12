import { Navbar } from '@/components/marketing/navbar'
import { PricingCards } from '@/components/marketing/pricing-cards'
import { Footer } from '@/components/marketing/footer'

export const metadata = {
  title: 'Pricing — Holy by Holystic Labs',
  description: 'Simple, transparent pricing for builders of all sizes.',
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F8FAFC]">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-[#A1A1AA]">
            Start free. Scale as you grow. No surprises.
          </p>
        </div>
        <PricingCards />
      </main>
      <Footer />
    </div>
  )
}
