import ExploreHero from "@/components/clinics/hero/HeroSection";
import TestimonialsSection from "@/components/clinics/testimonials/TestimonialsSection";
import Prefooter from "@/components/landing/prefooter/PrefooterSection";
import ContactSection from "@/components/landing/contact/ContactSection";
import FaqSection from "@/components/clinics/faq/FaqSection";
import { Header } from "@/components/header/Header";
import Footer from "@/components/landing/footer/Footer";
import CaracteristicsSection from "@/components/clinics/caracteristics/CaracteristicsSection";
import HighlightSection from "@/components/clinics/highlitghts/HighlitghtsSection";
import PanelSection from "@/components/landing/panel/PanelSection";
import Breadcrumbs from "@/components/Breadcrumbs";
import RateLimitTester from "@/components/dev/RateLimitTester";

export default function ClinicsPage() {
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
      {/* Rate Limit Tester (solo en desarrollo) */}
      <RateLimitTester />
    </main>
  );
}
