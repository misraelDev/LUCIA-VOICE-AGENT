import ExploreHero from "@/components/sales/hero/HeroSection";
import TestimonialsSection from "@/components/sales/testimonials/TestimonialsSection";
import Prefooter from "@/components/landing/prefooter/PrefooterSection";
import ContactSection from "@/components/landing/contact/ContactSection";
import FaqSection from "@/components/sales/faq/FaqSection";
import { Header } from "@/components/header/Header";
import Footer from "@/components/landing/footer/Footer";
import CaracteristicsSection from "@/components/sales/caracteristics/CaracteristicsSection";
import HighlightSection from "@/components/sales/highlitghts/HighlitghtsSection";
import PanelSection from "@/components/landing/panel/PanelSection";
import Breadcrumbs from "@/components/Breadcrumbs";
import FeaturesSection from "@/components/real-estate/features/FeaturesSection";

export default function CustomerExperiencePage() {
  return (
    <main className="overflow-x-hidden w-full">
      <Header />
      <Breadcrumbs />
      <ExploreHero />
      <FeaturesSection />
      {/* CARACTERISTICAS */}
      <CaracteristicsSection />
      {/* <BenefitsSection /> */}
      <TestimonialsSection />
      {/* HIGHLITGHTS */}
      <HighlightSection />
      {/* FAQ Section */}
      {/* Contacto Section */}
      <ContactSection />
      <FaqSection />
      <PanelSection />      {/* Prefooter Section */}
      <Prefooter />
      {/* Footer Section */}
      <Footer />
    </main>
  );
}
