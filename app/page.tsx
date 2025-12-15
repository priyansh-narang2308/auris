import FeaturesSection from "@/components/landing/features-section";
import HeroSection from "@/components/landing/hero-section";
import HowItWorks from "@/components/landing/how-it-works";
import IntegrationSection from "@/components/landing/integration-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesSection />
      <IntegrationSection />
      <HowItWorks />
    </div>
  );
}
