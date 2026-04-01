import ExploreHero from "@/components/ecommerce/hero/HeroSection";
import TestimonialsSection from "@/components/ecommerce/testimonials/TestimonialsSection";
import Prefooter from "@/components/landing/prefooter/PrefooterSection";
import ContactSection from "@/components/landing/contact/ContactSection";
import FaqSection from "@/components/ecommerce/faq/FaqSection";
import { Header } from "@/components/header/Header";
import Footer from "@/components/landing/footer/Footer";
import CaracteristicsSection from "@/components/ecommerce/caracteristics/CaracteristicsSection";
import HighlightSection from "@/components/ecommerce/highlitghts/HighlitghtsSection";
import PanelSection from "@/components/landing/panel/PanelSection";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function EcommercePage() {
  return (
    <main className="overflow-x-hidden w-full">
      <Header />
      <Breadcrumbs />
      <ExploreHero />
      {/* CARACTERISTICAS */}
      <CaracteristicsSection />
      {/* <BenefitsSection /> */}
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


