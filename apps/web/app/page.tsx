import { Header } from '@/app/home/header';
import { HeroSection } from '@/app/home/hero-section';
import { FeaturesSection } from '@/app/home/features-section';
import { SecuritySection } from '@/app/home/security-section';
import { PricingSection } from '@/app/home/pricing-section';
import { TestimonialsSection } from '@/app/home/testimonials-section';
import { Footer } from '@/app/home/footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <SecuritySection />
        <PricingSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
}
