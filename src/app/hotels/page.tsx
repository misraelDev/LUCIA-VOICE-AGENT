import ExploreHero from "@/components/hotels/hero/HeroSection";
// import BenefitsSection from "@/components/explore/benefits/BenefitsSection";
import TestimonialsSection from "@/components/hotels/testimonials/TestimonialsSection";
// import ScaleSection from "@/components/explore/caracteristics/scale/Scale";
import Prefooter from "@/components/landing/prefooter/PrefooterSection";
import ContactSection from "@/components/landing/contact/ContactSection";
import FaqSection from "@/components/hotels/faq/FaqSection";
import HighlightSection from "@/components/hotels/highlitghts/HighlitghtsSection";
import PanelSection from "@/components/landing/panel/PanelSection";
import { Header } from "@/components/header/Header";
import Footer from "@/components/landing/footer/Footer";
import CaracteristicsSection from "@/components/hotels/caracteristics/CaracteristicsSection";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function HotelsPage() {
  return (
    <main className="overflow-x-hidden w-full">
      <Header />
      <Breadcrumbs />

      <ExploreHero />
      {/* CARACTERISTICAS */}
      <CaracteristicsSection />
      <TestimonialsSection />
      {/* HIGHLITGHTS */}
      <HighlightSection />
      {/* FAQ Section */}
      <ContactSection />
      <FaqSection />
      <PanelSection />
      {/* Prefooter Section */}
      <Prefooter />
      {/* Footer Section */}
      <Footer />
    </main>
  );
}
