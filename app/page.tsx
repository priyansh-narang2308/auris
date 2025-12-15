import FeaturesSection from "@/components/landing/features-section";
import HeroSection from "@/components/landing/hero-section";
import IntegrationSection from "@/components/landing/integration-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesSection />
      <IntegrationSection/>
    </div>
  );
}
