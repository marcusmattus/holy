import { Navbar } from '@/components/marketing/navbar'
import { Hero } from '@/components/marketing/hero'
import { FeaturesGrid } from '@/components/marketing/features-grid'
import { EcosystemBar } from '@/components/marketing/ecosystem-bar'
import { PricingCards } from '@/components/marketing/pricing-cards'
import { CTABanner } from '@/components/marketing/cta-banner'
import { Footer } from '@/components/marketing/footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F8FAFC]">
      <Navbar />
      <main>
        <Hero />
        <FeaturesGrid />
        <EcosystemBar />
        <PricingCards />
        <CTABanner />
      </main>
      <Footer />
    </div>
  )
}
