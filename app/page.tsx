import CallToAction from "@/components/landing/cta-section";
import FeaturesSection from "@/components/landing/features-section";
import Footer from "@/components/landing/footer";

import HeroSection from "@/components/landing/hero-section";
import HowItWorks from "@/components/landing/how-it-works";
import IntegrationSection from "@/components/landing/integration-section";
import MoreFeaturesSection from "@/components/landing/more-features-section";
import { PricingSection } from "@/components/landing/pricing-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesSection />
      <IntegrationSection />
      <HowItWorks />
      <MoreFeaturesSection />
      <PricingSection />
      <CallToAction />
      <Footer />
    </div>
  );
}
