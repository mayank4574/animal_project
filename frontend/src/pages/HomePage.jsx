import HeroSection from '../components/home/HeroSection'
import TrustIndicators from '../components/home/TrustIndicators'
import ServicesSection from '../components/home/ServicesSection'
import FeaturedProviders from '../components/home/FeaturedProviders'
import WhyChooseUs from '../components/home/WhyChooseUs'
import ListBusinessCTA from '../components/home/ListBusinessCTA'
import SubmitCorrection from '../components/home/SubmitCorrection'

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <TrustIndicators />
      <ServicesSection />
      <FeaturedProviders />
      <WhyChooseUs />
      <ListBusinessCTA />
      <SubmitCorrection />
    </div>
  )
}
